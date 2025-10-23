using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Report.Api.Models;
using Report.Api.Repositories;

namespace Report.Api.Services;

public class MetricsCalculatedConsumer : BackgroundService
{
    private readonly ILogger<MetricsCalculatedConsumer> _logger;
    private readonly RabbitMqOptions _options;
    private readonly IServiceScopeFactory _scopeFactory;

    private IConnection? _connection;
    private IChannel? _channel;

    public MetricsCalculatedConsumer(
        ILogger<MetricsCalculatedConsumer> logger,
        IOptions<RabbitMqOptions> options,
        IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _options = options.Value;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        int attempt = 0;
        const int maxRetries = 10;

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                attempt++;
                var factory = new ConnectionFactory
                {
                    HostName = _options.HostName,
                    Port = _options.Port,
                    UserName = _options.UserName,
                    Password = _options.Password,
                    VirtualHost = _options.VirtualHost,
                    AutomaticRecoveryEnabled = true,
                    NetworkRecoveryInterval = TimeSpan.FromSeconds(5)
                };

                _connection = await factory.CreateConnectionAsync(_options.ClientProvidedName);
                _channel = await _connection.CreateChannelAsync();

                await _channel.ExchangeDeclareAsync(_options.MetricsExchange, ExchangeType.Topic, _options.Durable);
                await _channel.QueueDeclareAsync(_options.MetricsQueue, _options.Durable, false, false);
                await _channel.QueueBindAsync(_options.MetricsQueue, _options.MetricsExchange, _options.MetricsRoutingKey);
                await _channel.BasicQosAsync(0, _options.PrefetchCount, false);

                var consumer = new AsyncEventingBasicConsumer(_channel);
                consumer.ReceivedAsync += async (_, ea) =>
                {
                    var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                    try
                    {
                        using var doc = JsonDocument.Parse(json);
                        var root = doc.RootElement;

                        var metric = new ReportMetric
                        {
                            SubmissionId = root.GetProperty("submissionId").GetString() ?? string.Empty,
                            Language = root.GetProperty("language").GetString() ?? "unknown",
                            ErrorCount = root.GetProperty("errorCount").GetInt32(),
                            WarningCount = root.GetProperty("warningCount").GetInt32(),
                            InfoCount = root.TryGetProperty("infoCount", out var info) ? info.GetInt32() : 0,
                            IssueCount = root.GetProperty("issueCount").GetInt32(),
                            FileCount = root.GetProperty("fileCount").GetInt32(),
                            CodeQualityScore = root.TryGetProperty("codeQualityScore", out var score) ? score.GetInt32() : 0, 
                            CalculatedAt = root.GetProperty("calculatedAt").GetDateTimeOffset()
                        };

                        var issues = new List<LintingIssue>();
                        if (root.TryGetProperty("results", out var results) && results.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var issue in results.EnumerateArray())
                            {
                                issues.Add(new LintingIssue
                                {
                                    SubmissionId = metric.SubmissionId,
                                    Code = issue.TryGetProperty("code", out var c) ? c.GetString() ?? "" : "",
                                    Message = issue.TryGetProperty("message", out var m) ? m.GetString() ?? "" : "",
                                    Line = issue.TryGetProperty("line", out var l) && l.TryGetInt32(out var lineVal) ? lineVal : 0,
                                    Column = issue.TryGetProperty("column", out var col) && col.TryGetInt32(out var colVal) ? colVal : 0,
                                    Severity = issue.TryGetProperty("severity", out var s) ? s.GetString() ?? "info" : "info"
                                });
                            }
                        }

                        using var scope = _scopeFactory.CreateScope();
                        var repo = scope.ServiceProvider.GetRequiredService<IReportRepository>();

                        var existing = (await repo.GetAllAsync())
                            .FirstOrDefault(x => x.SubmissionId == metric.SubmissionId);
                        if (existing != null)
                            _logger.LogInformation("ℹ️ Updating existing metric for {SubmissionId}", metric.SubmissionId);

                        await repo.SaveAsync(metric);
                        await repo.SaveIssuesAsync(issues);

                        _logger.LogInformation(
                            "📊 Saved metric for {SubmissionId} | Errors={Errors}, Warnings={Warnings}, Infos={Infos}, QualityScore={Score}",
                            metric.SubmissionId, metric.ErrorCount, metric.WarningCount, metric.InfoCount, metric.CodeQualityScore);

                        await _channel.BasicAckAsync(ea.DeliveryTag, false);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Error processing metrics.calculated message: {Json}", json);
                        await _channel.BasicNackAsync(ea.DeliveryTag, false, true);
                    }
                };

                await _channel.BasicConsumeAsync(_options.MetricsQueue, false, "report-consumer", consumer);
                _logger.LogInformation("📡 Listening for metrics.calculated events...");

                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ RabbitMQ connection failed (attempt {Attempt}/{Max}): {Message}",
                    attempt, maxRetries, ex.Message);

                if (attempt >= maxRetries)
                {
                    _logger.LogError("❌ Could not connect to RabbitMQ after {MaxRetries} attempts. Stopping consumer.", maxRetries);
                    break;
                }

                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("🛑 MetricsCalculatedConsumer stopping...");

        if (_channel != null)
        {
            await _channel.CloseAsync();
            await _channel.DisposeAsync();
        }

        if (_connection != null)
        {
            await _connection.CloseAsync();
            await _connection.DisposeAsync();
        }

        await base.StopAsync(cancellationToken);
    }
}

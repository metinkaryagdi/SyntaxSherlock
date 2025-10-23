using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MetricsWorker.Repositories;
using MetricsWorker.Models;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace MetricsWorker.Services;

public sealed class MetricsConsumer : BackgroundService
{
    private readonly ILogger<MetricsConsumer> _logger;
    private readonly RabbitMqOptions _opt;
    private readonly IServiceScopeFactory _scopeFactory;

    private IConnection? _conn;
    private IChannel? _ch;

    private static readonly JsonSerializerOptions _json = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = false
    };

    public MetricsConsumer(
        ILogger<MetricsConsumer> logger,
        IOptions<RabbitMqOptions> opt,
        IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _opt = opt.Value;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await EnsureConnectedAsync();
                await ConsumeAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Consume döngüsünde hata. 5 sn sonra yeniden denenecek.");
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }

        await DisposeAsync();
    }

    private async Task EnsureConnectedAsync()
    {
        if (_conn is { IsOpen: true } && _ch is { IsOpen: true }) return;

        var factory = new ConnectionFactory
        {
            HostName = _opt.HostName,
            Port = _opt.Port,
            UserName = _opt.UserName,
            Password = _opt.Password,
            VirtualHost = _opt.VirtualHost,
            AutomaticRecoveryEnabled = true,
            TopologyRecoveryEnabled = true,
            ClientProvidedName = _opt.ClientProvidedName
        };

        _conn = await factory.CreateConnectionAsync();
        _ch = await _conn.CreateChannelAsync();

        await _ch.ExchangeDeclareAsync(_opt.LintingExchange, ExchangeType.Topic, _opt.Durable);
        await _ch.QueueDeclareAsync(_opt.LintingQueue, _opt.Durable, false, false);
        await _ch.QueueBindAsync(_opt.LintingQueue, _opt.LintingExchange, _opt.LintingRoutingKey);
        await _ch.QueueBindAsync(_opt.LintingQueue, _opt.LintingExchange, _opt.LintingFailedRoutingKey);

        await _ch.ExchangeDeclareAsync(_opt.MetricsExchange, ExchangeType.Topic, _opt.Durable);
        await _ch.BasicQosAsync(0, _opt.PrefetchCount, false);

        _logger.LogInformation("✅ RabbitMQ bağlı: Host={Host}, Queue={Queue}", _opt.HostName, _opt.LintingQueue);
    }

    private async Task ConsumeAsync(CancellationToken ct)
    {
        var consumer = new AsyncEventingBasicConsumer(_ch!);

        consumer.ReceivedAsync += async (_, ea) =>
        {
            try
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                if (string.IsNullOrWhiteSpace(json))
                {
                    _logger.LogWarning("⚠️ Boş mesaj alındı, atlanıyor.");
                    await _ch!.BasicAckAsync(ea.DeliveryTag, false);
                    return;
                }

                var metric = ComputeMetrics(json);

                int codeQualityScore = Math.Max(0,
                    100 - (metric.ErrorCount * 5 + metric.WarningCount * 2));

                metric.CodeQualityScore = codeQualityScore;

                using var scope = _scopeFactory.CreateScope();
                var repo = scope.ServiceProvider.GetRequiredService<IMetricsRepository>();
                await repo.SaveAsync(metric, ct);

                JsonElement? results = null;
                try
                {
                    var root = JsonDocument.Parse(json).RootElement;
                    if (root.TryGetProperty("results", out var r))
                        results = r;
                }
                catch (Exception e)
                {
                    _logger.LogWarning(e, "Results parse edilemedi.");
                }

                var evt = new
                {
                    type = "MetricsCalculatedEvent",
                    submissionId = metric.SubmissionId,
                    language = metric.Language,
                    errorCount = metric.ErrorCount,
                    warningCount = metric.WarningCount,
                    issueCount = metric.IssueCount,
                    fileCount = metric.FileCount,
                    codeQualityScore, 
                    calculatedAt = metric.CalculatedAt,
                    results
                };

                await PublishAsync(_opt.MetricsExchange, _opt.MetricsRoutingKey, evt);

                await _ch!.BasicAckAsync(ea.DeliveryTag, false);

                _logger.LogInformation("📊 Metrics computed for {SubmissionId} | Score={Score}", metric.SubmissionId, codeQualityScore);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Mesaj işlenemedi, tekrar kuyruğa alınacak.");
                await _ch!.BasicNackAsync(ea.DeliveryTag, false, true);
            }
        };

        await _ch!.BasicConsumeAsync(
            queue: _opt.LintingQueue,
            autoAck: false,
            consumerTag: $"metrics-worker-{Guid.NewGuid():N}",
            noLocal: false,
            exclusive: false,
            arguments: null,
            consumer: consumer,
            cancellationToken: ct);
    }

    private static LintingMetric ComputeMetrics(string json)
    {
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        static string GetString(JsonElement r, string name, string def = "") =>
            r.TryGetProperty(name, out var p) ? (p.GetString() ?? def) : def;

        static int GetInt(JsonElement r, string name, int def = 0) =>
            r.TryGetProperty(name, out var p) && p.TryGetInt32(out var v) ? v : def;

        return new LintingMetric(
            GetString(root, "submissionId", Guid.NewGuid().ToString("N")),
            GetString(root, "language", "unknown"),
            GetInt(root, "errorCount"),
            GetInt(root, "warningCount"),
            GetInt(root, "issueCount"),
            GetInt(root, "fileCount"),
            DateTimeOffset.UtcNow
        );
    }

    private async Task PublishAsync(string exchange, string routingKey, object obj)
    {
        var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(obj, _json));
        var props = new BasicProperties
        {
            ContentType = "application/json",
            DeliveryMode = DeliveryModes.Persistent
        };

        await _ch!.BasicPublishAsync(exchange, routingKey, false, props, bytes);
        _logger.LogInformation("📤 Published {RoutingKey}", routingKey);
    }

    private async Task DisposeAsync()
    {
        try { if (_ch is not null) { await _ch.CloseAsync(); await _ch.DisposeAsync(); } } catch { }
        try { if (_conn is not null) { await _conn.CloseAsync(); await _conn.DisposeAsync(); } } catch { }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("🛑 MetricsConsumer stopping...");
        await DisposeAsync();
        await base.StopAsync(cancellationToken);
    }
}

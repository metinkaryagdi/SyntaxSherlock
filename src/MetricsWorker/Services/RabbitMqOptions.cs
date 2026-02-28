namespace MetricsWorker.Services;

public sealed class RabbitMqOptions
{
    public string HostName { get; set; } = "localhost";
    public int Port { get; set; } = 5672;
    public string UserName { get; set; } = "guest";
    public string Password { get; set; } = "guest";
    public string VirtualHost { get; set; } = "/";
    public string? ClientProvidedName { get; set; } = "metrics-worker";

    public string LintingExchange { get; set; } = "linting.events";
    public string LintingRoutingKey { get; set; } = "linting.finished";
    public string LintingFailedRoutingKey { get; set; } = "linting.failed";
    public string LintingQueue { get; set; } = "metrics.linting.queue";

    public string MetricsExchange { get; set; } = "metrics.events";
    public string MetricsRoutingKey { get; set; } = "metrics.calculated";
    public string MetricsFailedRoutingKey { get; set; } = "metrics.failed";

    public ushort PrefetchCount { get; set; } = 10;
    public bool Durable { get; set; } = true;
}

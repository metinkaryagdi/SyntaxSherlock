namespace Report.Api.Services;

public class RabbitMqOptions
{
    public string HostName { get; set; } = "localhost";
    public int Port { get; set; } = 5672;
    public string UserName { get; set; } = "guest";
    public string Password { get; set; } = "guest";
    public string VirtualHost { get; set; } = "/";
    public string ClientProvidedName { get; set; } = "report-service";

    // 🔹 Metrics event yapılandırması
    public string MetricsExchange { get; set; } = "metrics.events";
    public string MetricsQueue { get; set; } = "report.metrics.calculated";
    public string MetricsRoutingKey { get; set; } = "metrics.calculated";

    // 🔹 Diğer RabbitMQ ayarları
    public ushort PrefetchCount { get; set; } = 10;
    public bool Durable { get; set; } = true;
}

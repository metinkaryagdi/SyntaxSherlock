// MetricsWorker/Models/MetricFailure.cs
namespace MetricsWorker.Models;

public sealed class MetricFailure
{
    public int Id { get; set; }
    public string SubmissionId { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;
    public DateTimeOffset FailedAt { get; set; }
}

using MetricsWorker.Models;

namespace MetricsWorker.Repositories;

public interface IMetricsRepository
{
    Task SaveAsync(LintingMetric metric, CancellationToken ct);
    Task SaveFailureAsync(string submissionId, string language, string error, DateTimeOffset failedAt, CancellationToken ct);
}

using MetricsWorker.Data;
using MetricsWorker.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MetricsWorker.Repositories;

public sealed class MetricsRepository : IMetricsRepository
{
    private readonly MetricsDbContext _ctx;
    private readonly ILogger<MetricsRepository> _logger;

    public MetricsRepository(MetricsDbContext ctx, ILogger<MetricsRepository> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    public async Task SaveAsync(LintingMetric metric, CancellationToken ct = default)
    {
        await _ctx.Metrics.AddAsync(metric, ct);
        await _ctx.SaveChangesAsync(ct);
        _logger.LogInformation("✅ Metric persisted for {SubmissionId}", metric.SubmissionId);
    }

    public async Task SaveFailureAsync(string submissionId, string language, string errorMessage, DateTimeOffset failedAt, CancellationToken ct = default)
    {
        var failure = new MetricFailure
        {
            SubmissionId = submissionId,
            Language = language,
            ErrorMessage = errorMessage,
            FailedAt = failedAt
        };

        await _ctx.Failures.AddAsync(failure, ct);
        await _ctx.SaveChangesAsync(ct);
        _logger.LogWarning("❌ Persisted failure for {SubmissionId} ({Lang})", submissionId, language);
    }
}

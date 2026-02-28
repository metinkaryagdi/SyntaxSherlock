using Microsoft.EntityFrameworkCore;
using Report.Api.Data;
using Report.Api.Models;

namespace Report.Api.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly ReportDbContext _db;

    public ReportRepository(ReportDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<ReportMetric>> GetAllAsync() =>
        await _db.ReportMetrics.AsNoTracking()
            .OrderByDescending(x => x.CalculatedAt)
            .ToListAsync();

    public async Task<ReportMetric?> GetBySubmissionIdAsync(string submissionId) =>
        await _db.ReportMetrics
            .Include(x => x.Issues)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.SubmissionId == submissionId);

    public async Task SaveAsync(ReportMetric metric)
    {
        var existing = await _db.ReportMetrics
            .FirstOrDefaultAsync(x => x.SubmissionId == metric.SubmissionId);

        if (existing != null)
            _db.ReportMetrics.Remove(existing);

        await _db.ReportMetrics.AddAsync(metric);
        await _db.SaveChangesAsync();
    }

    public async Task SaveIssuesAsync(IEnumerable<LintingIssue> issues)
    {
        if (!issues.Any()) return;
        await _db.LintingIssues.AddRangeAsync(issues);
        await _db.SaveChangesAsync();
    }

    public async Task<IEnumerable<LintingIssue>> GetIssuesBySubmissionIdAsync(string submissionId) =>
        await _db.LintingIssues
            .Where(x => x.SubmissionId == submissionId)
            .AsNoTracking()
            .ToListAsync();
}

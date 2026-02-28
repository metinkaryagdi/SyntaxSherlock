using Report.Api.Models;

namespace Report.Api.Repositories;

public interface IReportRepository
{
    Task<IEnumerable<ReportMetric>> GetAllAsync();
    Task<ReportMetric?> GetBySubmissionIdAsync(string submissionId);
    Task SaveAsync(ReportMetric metric);
    Task SaveIssuesAsync(IEnumerable<LintingIssue> issues);
    Task<IEnumerable<LintingIssue>> GetIssuesBySubmissionIdAsync(string submissionId);
}

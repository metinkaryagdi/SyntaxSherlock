namespace MetricsWorker.Models;

public class LintingMetric
{
    public string SubmissionId { get; set; } = string.Empty;
    public string Language { get; set; } = "unknown";
    public int ErrorCount { get; set; }
    public int WarningCount { get; set; }
    public int IssueCount { get; set; }
    public int FileCount { get; set; }
    public DateTimeOffset CalculatedAt { get; set; }
    public int CodeQualityScore { get; set; }  

    public LintingMetric() { }

    public LintingMetric(
        string submissionId,
        string language,
        int errorCount,
        int warningCount,
        int issueCount,
        int fileCount,
        DateTimeOffset calculatedAt)
    {
        SubmissionId = submissionId;
        Language = language;
        ErrorCount = errorCount;
        WarningCount = warningCount;
        IssueCount = issueCount;
        FileCount = fileCount;
        CalculatedAt = calculatedAt;
    }
}

using System.ComponentModel.DataAnnotations;

namespace Report.Api.Models;

public class ReportMetric
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string SubmissionId { get; set; } = string.Empty;

    [Required]
    public string Language { get; set; } = "unknown";

    public int ErrorCount { get; set; }
    public int WarningCount { get; set; }
    public int InfoCount { get; set; } 
    public int IssueCount { get; set; }
    public int FileCount { get; set; }

    public int CodeQualityScore { get; set; } 

    public DateTimeOffset CalculatedAt { get; set; }

    public ICollection<LintingIssue> Issues { get; set; } = new List<LintingIssue>();
}

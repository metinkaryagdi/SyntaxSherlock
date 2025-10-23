using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Report.Api.Models;

public class LintingIssue
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(64)]
    public string SubmissionId { get; set; } = default!;

    [Required]
    public string Code { get; set; } = default!;

    [Required]
    public string Message { get; set; } = default!;

    public int Line { get; set; }
    public int Column { get; set; }

    [Required, MaxLength(20)]
    public string Severity { get; set; } = "warning";

    [ForeignKey(nameof(Metric))]
    public Guid MetricId { get; set; }      
    public ReportMetric Metric { get; set; } = default!;
}

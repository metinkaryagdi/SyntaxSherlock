using Microsoft.AspNetCore.Mvc;
using Report.Api.Repositories;

namespace Report.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportRepository _repo;

    public ReportsController(IReportRepository repo)
    {
        _repo = repo;
    }

    // Tüm submission metriklerinin özet listesini döner.
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var all = await _repo.GetAllAsync();

        // Özet görünüm (sadece temel bilgiler)
        var summaries = all.Select(x => new
        {
            x.SubmissionId,
            x.Language,
            Errors = x.ErrorCount,
            Warnings = x.WarningCount,
            Infos = x.InfoCount,
            x.CodeQualityScore,
            Grade = GetGrade(x.CodeQualityScore),
            x.CalculatedAt
        });

        return Ok(summaries);
    }

    // Belirli bir submission'a ait detaylı metrik + linting hatalarını döner.
    [HttpGet("{submissionId}")]
    public async Task<IActionResult> GetBySubmission(string submissionId)
    {
        var metric = await _repo.GetBySubmissionIdAsync(submissionId);
        if (metric == null)
            return NotFound(new { message = $"No metric found for submission {submissionId}" });

        var issues = await _repo.GetIssuesBySubmissionIdAsync(submissionId);

        var response = new
        {
            submissionId = metric.SubmissionId,
            language = metric.Language,
            calculatedAt = metric.CalculatedAt,
            summary = new
            {
                errors = metric.ErrorCount,
                warnings = metric.WarningCount,
                infos = metric.InfoCount,
                totalIssues = metric.IssueCount,
                codeQuality = $"{metric.CodeQualityScore}/100",
                grade = GetGrade(metric.CodeQualityScore),
                evaluation = GetEvaluation(metric.CodeQualityScore)
            },
            issues = issues.Select(i => new
            {
                i.Code,
                i.Message,
                i.Line,
                i.Column,
                i.Severity
            })
        };

        return Ok(response);
    }

    // Skora göre harf notu (grade)
    private static string GetGrade(int score) =>
        score switch
        {
            >= 90 => "A+",
            >= 80 => "A",
            >= 70 => "B+",
            >= 60 => "B",
            >= 50 => "C",
            >= 40 => "D",
            _ => "F"
        };

    // Skora göre yorum
    private static string GetEvaluation(int score) =>
        score switch
        {
            >= 90 => "Excellent code quality 🟢",
            >= 80 => "Very good 🟢",
            >= 70 => "Good 🟡",
            >= 60 => "Satisfactory 🟡",
            >= 50 => "Needs improvement 🟠",
            >= 40 => "Poor quality 🔴",
            _ => "Critical issues ❌"
        };
}

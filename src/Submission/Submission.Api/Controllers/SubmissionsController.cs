using Contracts.Events;
using Microsoft.AspNetCore.Mvc;
using Submission.Api.Messaging;
using System.IO;

namespace Submission.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubmissionsController : ControllerBase
{
    private readonly IEventPublisher _publisher;
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _cfg;
    private readonly ILogger<SubmissionsController> _logger;

    public SubmissionsController(
        IEventPublisher publisher,
        IWebHostEnvironment env,
        IConfiguration cfg,
        ILogger<SubmissionsController> logger)
    {
        _publisher = publisher;
        _env = env;
        _cfg = cfg;
        _logger = logger;
    }

    // Kod dosyasını yükler ve otomatik olarak analize gönderir.
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload(
        [FromForm] IFormFile file,
        [FromForm] string? language = null,
        CancellationToken ct = default)
    {
        if (file == null || file.Length == 0)
            return BadRequest("❌ Dosya boş veya gönderilmedi.");

        var submissionId = Guid.NewGuid();
        var storageRoot = _cfg.GetValue<string>("Storage:Root") ?? "storage";
        var dir = Path.Combine(_env.ContentRootPath, storageRoot, submissionId.ToString("N"));
        Directory.CreateDirectory(dir);

        var safeFileName = Path.GetFileName(file.FileName);
        var filePath = Path.Combine(dir, safeFileName);

        await using (var fs = System.IO.File.Create(filePath))
            await file.CopyToAsync(fs, ct);

        // Dil otomatik tespiti (uzantıdan)
        language ??= DetectLanguageFromExtension(file.FileName);

        _logger.LogInformation("📁 File uploaded: {Path} (Lang={Lang})", filePath, language);

        // Event oluştur ve kuyruğa gönder
        var evt = new CodeSubmittedEvent(
            SubmissionId: submissionId,
            FilePath: filePath,
            Language: language ?? "unknown",
            SubmittedAtUtc: DateTime.UtcNow
        );

        await _publisher.PublishAsync(evt, routingKey: "code.submitted", ct);
        _logger.LogInformation("📤 Published code.submitted for {SubmissionId}", submissionId);

        return Accepted(new
        {
            submissionId,
            language,
            fileName = safeFileName,
            message = "✅ Kod başarıyla yüklendi ve analize gönderildi."
        });
    }

    // Uzantıya göre dil belirleme (ileride ML ile geliştirilebilir)
    private static string DetectLanguageFromExtension(string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        return ext switch
        {
            ".py" => "python",
            ".cs" => "csharp",
            ".js" => "javascript",
            ".ts" => "typescript",
            ".java" => "java",
            ".cpp" => "cpp",
            ".c" => "c",
            ".html" => "html",
            ".css" => "css",
            ".go" => "go",
            ".rb" => "ruby",
            _ => "unknown"
        };
    }
}

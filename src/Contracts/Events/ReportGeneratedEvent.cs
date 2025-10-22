namespace Contracts.Events
{
    public record ReportGeneratedEvent(
        Guid SubmissionId,
        string ReportUrl,
        string Format,
        DateTime GeneratedAtUtc
    );
}

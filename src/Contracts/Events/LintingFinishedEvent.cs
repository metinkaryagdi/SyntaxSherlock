namespace Contracts.Events
{
    public record LintingFinishedEvent(
        Guid SubmissionId,
        string FilePath,
        string Language,
        DateTime CompletedAtUtc,
        int ErrorCount,
        IEnumerable<string>? Errors
    );
}

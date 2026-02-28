namespace Contracts.Events
{
    public record LintingFailedEvent(
        Guid SubmissionId,
        string FilePath,
        string Language,
        string ErrorMessage,
        DateTime FailedAtUtc
    );
}

namespace Contracts.Events
{
    public record CodeSubmittedEvent(
        Guid SubmissionId,
        string FilePath,
        string Language,
        DateTime SubmittedAtUtc
    );
}

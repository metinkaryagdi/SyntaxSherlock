namespace Contracts.Events
{
    public record MetricsFailedEvent(
        Guid SubmissionId,
        string Language,
        string ErrorMessage,
        DateTime FailedAtUtc
    );
}

namespace Contracts.Events
{
    public record MetricsCalculatedEvent(
        Guid SubmissionId,
        string Language,
        int ErrorCount,
        bool HasErrors,
        IEnumerable<string>? TopErrorTypes,
        DateTime CalculatedAtUtc
    );
}

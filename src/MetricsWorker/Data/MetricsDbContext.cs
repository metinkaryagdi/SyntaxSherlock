// MetricsWorker/Data/MetricsDbContext.cs
using MetricsWorker.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace MetricsWorker.Data;

public sealed class MetricsDbContext : DbContext
{
    public DbSet<LintingMetric> Metrics => Set<LintingMetric>();
    public DbSet<MetricFailure> Failures => Set<MetricFailure>();

    public MetricsDbContext(DbContextOptions<MetricsDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LintingMetric>(e =>
        {
            e.HasKey(x => x.SubmissionId);
            e.Property(x => x.SubmissionId).HasMaxLength(64);
            e.Property(x => x.Language).HasMaxLength(50);
        });

        modelBuilder.Entity<MetricFailure>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.SubmissionId).HasMaxLength(64);
            e.Property(x => x.Language).HasMaxLength(50);
            e.Property(x => x.ErrorMessage).HasMaxLength(500);
        });
    }
}

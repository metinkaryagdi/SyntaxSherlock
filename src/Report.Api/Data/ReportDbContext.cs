using Microsoft.EntityFrameworkCore;
using Report.Api.Models;

namespace Report.Api.Data
{
    public class ReportDbContext : DbContext
    {
        public ReportDbContext(DbContextOptions<ReportDbContext> options)
            : base(options) { }

        public DbSet<ReportMetric> ReportMetrics => Set<ReportMetric>();
        public DbSet<LintingIssue> LintingIssues => Set<LintingIssue>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ReportMetric>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.SubmissionId).HasMaxLength(64).IsRequired();
                e.HasIndex(x => x.SubmissionId).IsUnique(); 
            });

            modelBuilder.Entity<LintingIssue>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.SubmissionId).HasMaxLength(64).IsRequired();

                e.HasOne(i => i.Metric)
                    .WithMany()
                    .HasForeignKey(i => i.SubmissionId)
                    .HasPrincipalKey(m => m.SubmissionId);
            });
        }


    }
}

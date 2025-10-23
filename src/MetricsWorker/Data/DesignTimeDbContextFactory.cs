using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MetricsWorker.Data;

namespace MetricsWorker.Data;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<MetricsDbContext>
{
    public MetricsDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<MetricsDbContext>();

        // Lokal ortam için doğru connection string
        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5432;Database=syntaxsherlock;Username=ssuser;Password=sspass");

        return new MetricsDbContext(optionsBuilder.Options);
    }
}

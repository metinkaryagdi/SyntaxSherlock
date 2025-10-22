using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Report.Api.Data;

public class ReportDbContextFactory : IDesignTimeDbContextFactory<ReportDbContext>
{
    public ReportDbContext CreateDbContext(string[] args)
    {
        // EF migration sırasında appsettings.json'u okuyacak
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<ReportDbContext>();
        optionsBuilder.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));

        return new ReportDbContext(optionsBuilder.Options);
    }
}

using Microsoft.EntityFrameworkCore;
using MetricsWorker.Data;
using MetricsWorker.Repositories;
using MetricsWorker.Services;

var builder = Host.CreateApplicationBuilder(args);

// PostgreSQL bağlantısı
builder.Services.AddDbContext<MetricsDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

// RabbitMQ ve servisler
builder.Services.Configure<RabbitMqOptions>(builder.Configuration.GetSection("RabbitMq"));
builder.Services.AddScoped<IMetricsRepository, MetricsRepository>();
builder.Services.AddHostedService<MetricsConsumer>();

var app = builder.Build();

// Otomatik migration (development ortamında)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MetricsDbContext>();
    db.Database.Migrate();
}

await app.RunAsync();

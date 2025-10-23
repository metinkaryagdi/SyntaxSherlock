using Microsoft.EntityFrameworkCore;
using Report.Api.Data;
using Report.Api.Repositories;
using Report.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// PostgreSQL bağlantısı
builder.Services.AddDbContext<ReportDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// RabbitMQ ayarları
builder.Services.Configure<RabbitMqOptions>(builder.Configuration.GetSection("RabbitMq"));

// Repository & Consumer servisleri
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddHostedService<MetricsCalculatedConsumer>();

// API Controller & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Otomatik migration (veritabanı yoksa oluştur)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ReportDbContext>();
    db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

Console.WriteLine($"✅ Report.Api started in {builder.Environment.EnvironmentName} mode...");
Console.WriteLine($"📡 DB Connection: {builder.Configuration.GetConnectionString("DefaultConnection")}");

app.Run();

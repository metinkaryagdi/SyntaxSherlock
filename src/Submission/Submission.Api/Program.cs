using System.Reflection;
using Microsoft.OpenApi.Models;
using Submission.Api.Messaging;

var builder = WebApplication.CreateBuilder(args);

// 🔹 RabbitMQ config
builder.Services.Configure<RabbitMqOptions>(builder.Configuration.GetSection("RabbitMq"));
builder.Services.AddSingleton<IEventPublisher, RabbitMqPublisher>();

// 🔹 Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SyntaxSherlock Submission API",
        Version = "v1",
        Description = "Handles code uploads and publishes them for linting."
    });
});

var app = builder.Build();

// Swagger (her zaman açık, local test için)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Submission API v1");
});

// Routing ve controller mapping
app.UseRouting();
app.MapControllers();

// Container içinde 8080 portunu dinle
Console.WriteLine("✅ Submission.API started and waiting for uploads...");
app.Run("http://0.0.0.0:8080");

using Yarp.ReverseProxy;

var builder = WebApplication.CreateBuilder(args);

// Reverse proxy yapılandırmasını yükle
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// CORS (frontend erişimi için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// CORS aktif
app.UseCors("AllowAll");

// Proxy rotalarını YARP'tan yükle
app.MapReverseProxy();

// Basit health endpoint
app.MapGet("/", () => Results.Ok(new
{
    message = "🧩 SyntaxSherlock API Gateway is running",
    environment = app.Environment.EnvironmentName,
    time = DateTime.UtcNow
}));

// Dışarıdan erişim için 0.0.0.0:5000'de dinle
app.Run("http://0.0.0.0:5000");

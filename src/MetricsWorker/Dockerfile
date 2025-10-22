# === Build Stage ===
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# === Runtime Stage ===
FROM mcr.microsoft.com/dotnet/runtime:9.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "MetricsWorker.dll"]

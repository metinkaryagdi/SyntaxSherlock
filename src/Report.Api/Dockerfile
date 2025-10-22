# === Build Stage ===
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# === Runtime Stage ===
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Report.Api.dll"]

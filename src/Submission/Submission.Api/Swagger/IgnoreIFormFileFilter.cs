using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Submission.Api.Swagger;

public class IgnoreIFormFileFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        // Swagger'ın çöktüğü Upload endpoint'ini manuel olarak tanımla
        swaggerDoc.Paths["/api/submissions/upload"] = new OpenApiPathItem
        {
            Operations = new Dictionary<OperationType, OpenApiOperation>
            {
                [OperationType.Post] = new OpenApiOperation
                {
                    Summary = "Kod yükler ve kuyruğa gönderir",
                    RequestBody = new OpenApiRequestBody
                    {
                        Content = new Dictionary<string, OpenApiMediaType>
                        {
                            ["multipart/form-data"] = new OpenApiMediaType
                            {
                                Schema = new OpenApiSchema
                                {
                                    Type = "object",
                                    Properties = new Dictionary<string, OpenApiSchema>
                                    {
                                        ["file"] = new OpenApiSchema
                                        {
                                            Type = "string",
                                            Format = "binary",
                                            Description = "Yüklenecek Python dosyası"
                                        },
                                        ["language"] = new OpenApiSchema
                                        {
                                            Type = "string",
                                            Description = "Programlama dili (örn: python)"
                                        }
                                    },
                                    Required = new HashSet<string> { "file" }
                                }
                            }
                        }
                    },
                    Responses = new OpenApiResponses
                    {
                        ["202"] = new OpenApiResponse { Description = "Kod kuyruğa eklendi." },
                        ["400"] = new OpenApiResponse { Description = "Geçersiz istek." }
                    }
                }
            }
        };
    }
}

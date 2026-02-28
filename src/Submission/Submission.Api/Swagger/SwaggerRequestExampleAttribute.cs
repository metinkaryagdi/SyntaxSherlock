using System;

namespace Submission.Api.Swagger
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class SwaggerRequestExampleAttribute : Attribute
    {
        public SwaggerRequestExampleAttribute(Type requestType, Type exampleType) { }
    }
}

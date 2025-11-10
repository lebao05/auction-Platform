using Microsoft.Extensions.DependencyInjection;

namespace Presentation
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPresentationDependencies(this IServiceCollection services)
        {
            return services;
        }
    }
}

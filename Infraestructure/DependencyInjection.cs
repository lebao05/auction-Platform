using Application.Abstractions;
using Infraestructure.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Infraestructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services)
        {
         
            services.AddScoped<IUserHelper, UserHelper>();
            return services;
        }
    }
}

using Application.Abstractions;
using Domain.Repositories;
using Infraestructure.Externals;
using Infraestructure.Identity;
using Infraestructure.Persistence.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Infraestructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services)
        {
         
            services.AddScoped<IUserHelper, UserHelper>();
            services.AddScoped<IUserRepository,UserRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IFileStorageService, AzureBlobStorageService>();
            return services;
        }
    }
}

using Microsoft.Extensions.DependencyInjection;
using Presentation.SignalR;

namespace Presentation
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPresentationDependencies(this IServiceCollection services)
        {
            services.AddSingleton<IPresenceTracker, PresenceTracker>();
            services.AddSignalR();
            return services;
        }
    }
}

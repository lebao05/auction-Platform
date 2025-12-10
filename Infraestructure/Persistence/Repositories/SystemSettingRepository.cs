using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Persistence.Repositories
{
    public class SystemSettingRepository : ISystemSettingRepository
    {
        private readonly ApplicationDbContext _appContext;
        public SystemSettingRepository(ApplicationDbContext appContext)
        {
            _appContext = appContext;
        }

        public async Task<List<SystemSetting>> GetAllSystemSettings(CancellationToken cancellationToken)
        {
            return await _appContext.SystemSettings.ToListAsync();
        }

        public async Task<SystemSetting?> GetSystemSettingByKey(string key, CancellationToken cancellation)
        {
            return await _appContext.SystemSettings.Where( s=>s.SystemKey == key ).FirstOrDefaultAsync();
        }

    }
}

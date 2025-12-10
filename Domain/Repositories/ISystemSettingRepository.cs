using Domain.Entities;

namespace Domain.Repositories
{
    public interface ISystemSettingRepository
    {
        Task<List<SystemSetting>> GetAllSystemSettings(CancellationToken cancellationToken);
        Task<SystemSetting?> GetSystemSettingByKey(string key, CancellationToken cancellation);
    }
}

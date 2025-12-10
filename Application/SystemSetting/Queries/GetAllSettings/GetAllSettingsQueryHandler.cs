using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.SystemSetting.Queries.GetAllSettings
{
    public class GetAllSettingsQueryHandler : IQueryHandler<GetAllSettingsQuery,
        List<SystemSettingResponse>>
    {
        private readonly ISystemSettingRepository _systemSettingRepository;
        public GetAllSettingsQueryHandler(ISystemSettingRepository systemSettingRepository)
        {
            _systemSettingRepository = systemSettingRepository;
        }
        public async Task<Result<List<SystemSettingResponse>>> Handle(GetAllSettingsQuery request, CancellationToken cancellationToken)
        {
            var res = await _systemSettingRepository.GetAllSystemSettings(cancellationToken);
            var dto = res.Select( 
                s=> new SystemSettingResponse(s.SystemKey, s.SystemValue))
                .ToList();
            return Result.Success<List<SystemSettingResponse>>(dto);
        }
    }
}

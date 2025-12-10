using Application.Abstractions.Messaging;

namespace Application.SystemSetting.Queries.GetAllSettings
{
    public sealed record GetAllSettingsQuery() : IQuery<List<SystemSettingResponse>>;
}

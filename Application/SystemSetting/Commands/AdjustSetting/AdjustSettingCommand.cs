
using Application.Abstractions.Messaging;

namespace Application.SystemSetting.Commands.AdjustSetting
{
    public sealed record AdjustSettingCommand(string SystemKey,int SystemValue):ICommand;
}

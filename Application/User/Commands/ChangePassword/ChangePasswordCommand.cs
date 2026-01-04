using Application.Abstractions.Messaging;

namespace Application.User.Commands.ChangePassword
{
    public sealed record ChangePasswordCommand(string UserId,string OldPassword, string NewPassword) : ICommand;
}

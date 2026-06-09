using Application.Abstractions.Messaging;

namespace Application.User.Commands.ResetUserPassword
{
    public sealed record ResetUserPasswordCommand(Guid UserId) : ICommand;
}

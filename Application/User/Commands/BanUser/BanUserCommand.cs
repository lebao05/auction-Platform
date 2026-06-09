using Application.Abstractions.Messaging;

namespace Application.User.Commands.BanUser
{
    public sealed record BanUserCommand(Guid UserId) : ICommand;
}

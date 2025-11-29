using Application.Abstractions.Messaging;

namespace Application.User.Commands.Login
{
    public sealed record LoginCommand(string email, string password) : ICommand<string>;
}

using Application.Abstractions.Messaging;

namespace Application.User.Commands.Create
{
    public sealed record RegisterCommand(string username, string email, string password,string address) : ICommand<string>;
}

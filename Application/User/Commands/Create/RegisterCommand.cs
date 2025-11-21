using Application.Abstractions.Messaging;
using Domain.Entities;

namespace Application.User.Commands.Create
{
    public sealed record RegisterCommand(string fullname, string username, string email, string password) : ICommand<Guid>;
}

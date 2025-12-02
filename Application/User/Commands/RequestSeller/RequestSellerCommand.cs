using Application.Abstractions.Messaging;

namespace Application.User.Commands.RequestSeller
{
    public sealed record RequestSellerCommand(Guid userId) : ICommand;
}

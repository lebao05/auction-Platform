using Application.Abstractions.Messaging;

namespace Application.Product.Commands.CancelOrder
{
    public sealed record CancelOrderCommand(Guid UserId, Guid ProductId) : ICommand;
}

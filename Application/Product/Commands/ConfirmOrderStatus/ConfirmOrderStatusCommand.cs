using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Product.Commands.ConfirmOrderStatus
{
    public sealed record ConfirmOrderStatusCommand(Guid UserId, Guid ProductId, OrderStatus Status) : ICommand;
}

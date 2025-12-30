using Application.Abstractions.Messaging;

namespace Application.Product.Commands.UpdateShippingPhaseOfOrder
{
    public sealed record UpdateShippingPhaseOfOrderCommand(Guid UserId,Guid ProductId, string ShippingInvoiceUrl) : ICommand;
}

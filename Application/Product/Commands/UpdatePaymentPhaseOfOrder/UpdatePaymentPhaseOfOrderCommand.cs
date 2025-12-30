

using Application.Abstractions.Messaging;

namespace Application.Product.Commands.UpdatePaymentPhaseOfOrder
{
    public sealed record UpdatePaymentPhaseOfOrderCommand(Guid UserId, Guid ProductId, string? ShippingAddress, string? ShippingPhone,
        string? PaymentInvoiceUrl) : ICommand;
}

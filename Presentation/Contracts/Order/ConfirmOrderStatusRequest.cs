using Domain.Enums;

namespace Presentation.Contracts.Order
{
    public class ConfirmOrderStatusRequest
    {
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Shipping;
    }
}

using Domain.Enums;
namespace Application.Product.Queries.GetOrder
{
    public class GetOrderResponse
    {
        public OrderStatus OrderStatus { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public long FinalPrice { get; set; }
        public string MainImageUrl { get; set; } = string.Empty;

        //buyer info
        public Guid BuyerId { get; set; }
        public string BuyerName { get; set; } = string.Empty;
        public string? BuyerAvatarUrl { get; set; } = string.Empty;
        // Seller info

        public Guid SellerId { get; set; }
        public string SellerName { get; set; } = string.Empty;
        public string? SellerAvatarUrl { get; set; } = string.Empty;

        // Buyer / shipping info
        public string? ShippingAddress { get; set; } = string.Empty;
        public string? ShippingPhone { get; set; } = string.Empty;

        // Payment
        public string? PaymentInvoiceUrl { get; set; } = string.Empty;

        public string? ShippingInvoiceUrl { get; set; } = string.Empty;
        public string ProductImageUrl { get; set; } = null!;

        // Buyer rates Seller

        public RatingDto? BuyerRating { get; set; }

        // Seller rates Buyer
        public RatingDto? SellerRating { get; set; }
    }
}

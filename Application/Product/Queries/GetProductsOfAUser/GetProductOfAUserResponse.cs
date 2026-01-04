using Domain.Enums;

namespace Application.Product.Queries.GetProductsOfAUser
{
    public sealed class GetProductOfAUserResponse
    {
        public ICollection<ProductDto> ProductsWon { get; init; } = new List<ProductDto>();
        public ICollection<ProductDto> ProductsSelling { get; init; } = new List<ProductDto>();
        public ICollection<ProductDto> ProductsSold { get; init; } = new List<ProductDto>();
        public ICollection<ProductDto>? ProductsBidding { get; init; } = new List<ProductDto>();
    }
    public sealed class ProductDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; } = string.Empty;

        public long StartPrice { get; init; }
        public long StepPrice { get; init; }
        public long? BuyNowPrice { get; init; }

        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }

        public OrderStatus OrderStatus { get; init; }

        // Category
        public Guid? CategoryId { get; init; }
        public string? CategoryName { get; init; }

        // Seller
        public Guid SellerId { get; init; }
        public string SellerName { get; init; } = string.Empty;

        public Guid? WinnerId { get; set; }
        public string? WinnerName { get; set; }
        public long? HighestBid { get; init; }

        public long? YourBidding { get; init; }

        // Images
        public string? MainImageUrl { get; init; }

        // Bidding
        public int BiddingCount { get; init; }

        // User-related flags (VERY useful)
        public bool IsSelling { get; init; }
        public bool IsWon { get; init; }
        public bool IsSellEnded { get; init; }
        public bool IsBidding { get; init; }
    }

}

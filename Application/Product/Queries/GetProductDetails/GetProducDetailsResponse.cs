namespace Application.Product.Queries.GetProductDetails
{
    public class GetProductDetailsResponse
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public long? BuyNowPrice { get; set; }

        public long StartPrice { get; set; }

        public long StepPrice { get; set; }

        public bool AllowAll { get; set; }

        public int BiddingCount { get; set; }

        public bool IsAutoRenewal { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Description { get; set; } = string.Empty;

        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }

        // Seller
        public Guid SellerId { get; set; }
        public string SellerFullName { get; set; } = string.Empty;
        public TopBidding? TopBidding { get; set; }

        public List<ProductImageDto> Images { get; set; } = new();

        public List<BiddingHistoryDto> BiddingHistories { get; set; } = new();
        // Comments
        public List<CommentDto> Comments { get; set; } = new();
    }

    public class ProductImageDto
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsMain { get; set; }
    }
    public class TopBidding
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = null!;
        public long BidAmount { get; set; }
    }
    public class BiddingHistoryDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = null!;
        public long BidAmount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CommentDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}

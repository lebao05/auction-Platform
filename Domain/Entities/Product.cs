using Domain.Common;
namespace Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string BidType { get; set; } = "normal"; // normal or auto
        public decimal? BuyNowPrice { get; set; }
        public bool MultipleBidIncrement { get; set; }
        public int BidAmount { get; set; }
        public decimal CurrentMaxBidAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsAutomaticallyRenewed { get; set; }

        public int SellerId { get; set; }
        public User Seller { get; set; } = null!;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        // Navigation Properties
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<BiddingHistory> BiddingHistories { get; set; } = new List<BiddingHistory>();
        public ICollection<ProductDescriptionHistory> DescriptionHistories { get; set; } = new List<ProductDescriptionHistory>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Blacklist> Blacklists { get; set; } = new List<Blacklist>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }
}

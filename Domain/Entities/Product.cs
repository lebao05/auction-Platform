using Domain.Common;
namespace Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public long? BuyNowPrice { get; set; }
        public bool AllowAll { get; set; } = true;
        public int BiddingCount { get; set; } = 0;
        public long CurrentMaxBidAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid SellerId { get; set; }
        public User Seller { get; set; } = null!;
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        // Navigation Properties
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<BiddingHistory> BiddingHistories { get; set; } = new List<BiddingHistory>();
        public ICollection<ProductDescriptionHistory> DescriptionHistories { get; set; } = new List<ProductDescriptionHistory>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<BlackList> Blacklists { get; set; } = new List<BlackList>();
    }
}

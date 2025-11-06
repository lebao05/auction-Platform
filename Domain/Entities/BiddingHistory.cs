using Domain.Common;

namespace Domain.Entities
{
    public class BiddingHistory : BaseEntity
    {
        public decimal BidAmount { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int BidderId { get; set; }
        public User Bidder { get; set; } = null!;
    }
}

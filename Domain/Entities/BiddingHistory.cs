using Domain.Common;

namespace Domain.Entities
{
    public class BiddingHistory : BaseEntity
    {
        public long BidAmount { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public Guid BidderId { get; set; }
        public User Bidder { get; set; } = null!;
    }
}

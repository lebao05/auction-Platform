using Domain.Common;

namespace Domain.Entities
{
    public class BiddingHistory : BaseEntity
    {
        public long BidAmount { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public Guid BidderId { get; set; }
        public AppUser Bidder { get; set; } = null!;
        public BiddingHistory(long bidAmount,Guid productId,Guid bidderId)
        {
            BidAmount = bidAmount;
            ProductId = productId;
            BidderId = bidderId;
        }
    }
}

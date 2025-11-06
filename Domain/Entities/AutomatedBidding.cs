using Domain.Common;

namespace Domain.Entities
{
    public class AutomatedBidding : BaseEntity
    {
        public decimal MaxBidAmount { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int BidderId { get; set; }
        public User Bidder { get; set; } = null!;
    }
}

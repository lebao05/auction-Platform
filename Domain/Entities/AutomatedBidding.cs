using Domain.Common;

namespace Domain.Entities
{
    public class AutomatedBidding : BaseEntity
    {
        public long MaxBidAmount { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public Guid BidderId { get; set; }
        public AppUser Bidder { get; set; } = null!;
    }
}

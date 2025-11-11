using Domain.Common;

namespace Domain.Entities
{
    public class BlackList : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public Guid SellerId { get; set; }
        public User Seller { get; set; } = null!;

        public Guid BidderId { get; set; }
        public User Bidder { get; set; } = null!;
    }
}

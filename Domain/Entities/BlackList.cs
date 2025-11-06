using Domain.Common;

namespace Domain.Entities
{
    public class BlackList : BaseEntity
    {
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int SellerId { get; set; }
        public User Seller { get; set; } = null!;

        public int BidderId { get; set; }
        public User Bidder { get; set; } = null!;
    }
}

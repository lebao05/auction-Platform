using Domain.Common;

namespace Domain.Entities
{
    public class BlackList : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public Guid SellerId { get; set; }
        public AppUser Seller { get; set; } = null!;

        public Guid BidderId { get; set; }
        public AppUser Bidder { get; set; } = null!;
        private BlackList()
        {
            
        }
        public BlackList(Guid productId, Guid sellerId, Guid bidderId,Guid Id) : base(Id)
        {
            ProductId = productId;
            SellerId = sellerId;
            BidderId = bidderId;
        }
    }
}

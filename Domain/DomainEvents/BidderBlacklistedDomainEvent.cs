using Domain.Common;

namespace Domain.DomainEvents
{
    public sealed class BidderBlacklistedDomainEvent : IDomainEvent
    {
        public Guid ProductId { get; }
        public Guid SellerId { get; }
        public Guid BidderId { get; }

        public BidderBlacklistedDomainEvent(
            Guid productId,
            Guid sellerId,
            Guid bidderId)
        {
            ProductId = productId;
            SellerId = sellerId;
            BidderId = bidderId;
        }
    }
}

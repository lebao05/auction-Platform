using Domain.Common;

namespace Domain.DomainEvents
{
    public sealed class BidPlacedSuccessfullyDomainEvent : IDomainEvent
    {
        public Guid ProductId { get; }
        public Guid SellerId { get; }
        public Guid NewBidderId { get; }
        public Guid? PreviousBidderId { get; }
        public long NewPrice { get; }

        public BidPlacedSuccessfullyDomainEvent(
            Guid productId,
            Guid sellerId,
            Guid newBidderId,
            Guid? previousBidderId,
            long newPrice)
        {
            ProductId = productId;
            SellerId = sellerId;
            NewBidderId = newBidderId;
            PreviousBidderId = previousBidderId;
            NewPrice = newPrice;
        }
    }
}

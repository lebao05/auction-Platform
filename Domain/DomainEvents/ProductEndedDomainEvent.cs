using Domain.Common;

namespace Domain.DomainEvents
{

    public sealed class ProductEndedDomainEvent : IDomainEvent
    {
        public Guid ProductId { get; }
        public Guid SellerId { get; }
        public Guid? WinnerId { get; }

        public ProductEndedDomainEvent(Guid productId, Guid sellerId, Guid? winnerId)
        {
            ProductId = productId;
            SellerId = sellerId;
            WinnerId = winnerId;
        }
    }
}

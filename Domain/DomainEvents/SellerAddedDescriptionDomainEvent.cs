using Domain.Common;
namespace Domain.DomainEvents
{
    public sealed class SellerAddedDescriptionDomainEvent : IDomainEvent
    {
        public Guid ProductId { get; }
        public Guid SellerId { get; }
        public string Description { get; }

        public SellerAddedDescriptionDomainEvent(
            Guid productId,
            Guid sellerId,
            string description)
        {
            ProductId = productId;
            SellerId = sellerId;
            Description = description;
        }
    }
}

using Domain.Common;

namespace Domain.DomainEvents
{
    public sealed class ProductImagesCreatedEvent : IDomainEvent
    {
        public Guid ProductId { get; }
        public List<Guid> ProductImageIds { get; }
        public List<string> ImagePaths { get; }

        public ProductImagesCreatedEvent(Guid productId, List<Guid> productImageIds, List<string> imagePaths)
        {
            ProductId = productId;
            ProductImageIds = productImageIds;
            ImagePaths = imagePaths;
        }
    }
}

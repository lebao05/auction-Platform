using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.DomainEvents;
using Domain.Repositories;

namespace Application.Product.Events
{
    public sealed class ProductImagesCreatedEventHandler
        : IDomainEventHandler<ProductImagesCreatedEvent>
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProductImagesCreatedEventHandler(
            IFileStorageService fileStorageService,
            IProductRepository productRepository,
            IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;   
            _fileStorageService = fileStorageService;
            _productRepository = productRepository;
        }

        public async Task Handle(ProductImagesCreatedEvent notification, CancellationToken cancellationToken)
        {
            // 1. Load product with images
            var product = await _productRepository.GetProductWithImagesAsync(
                notification.ProductId,
                cancellationToken);

            if (product is null)
                throw new Exception("Product.NotFound");

            for (int i = 0; i < notification.ProductImageIds.Count; i++)
            {
                var productImageId = notification.ProductImageIds[i];
                var localPath = notification.ImagePaths[i];

                // Upload image to storage and get URL
                var blobUrl = await _fileStorageService.UploadFileAsync(localPath, cancellationToken);

                // Update ProductImage with uploaded URL
                var productImage = product.Images.FirstOrDefault(x => x.Id == productImageId);
                if (productImage != null)
                {
                    productImage.UpdateUrl(blobUrl);
                }
            }

            // 3. Persist changes
            await _productRepository.UpdateAsync(product, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}

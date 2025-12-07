using Domain.Entities;

namespace Domain.Repositories
{
    public interface IProductRepository
    {
        Task AddProductAsync(Product entity,CancellationToken cancellationToken);
        Task<Product?> GetProductWithImagesAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Product>> GetProductsForSeller(Guid sellerId, CancellationToken cancellationToken);
        Task UpdateAsync(Product entity, CancellationToken cancellationToken);

    }
}

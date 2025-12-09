using Domain.Entities;

namespace Domain.Repositories
{
    public interface IProductRepository
    {
        Task AddProductAsync(Product entity,CancellationToken cancellationToken);
        Task<Product?> GetProductWithImagesAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Product>> GetProductsForSeller(Guid sellerId, CancellationToken cancellationToken);
        Task UpdateAsync(Product entity, CancellationToken cancellationToken);
        Task<Product?> GetProductDetails(Guid id, CancellationToken cancellationToken);

        Task<Product?> GetProductForPlaceBid(Guid id, CancellationToken cancellationToken);
        Task<AutomatedBidding?> GetAutoBidding(Guid userId, Guid productId, CancellationToken cancellationToken);
        void UpdateAutoBidding(AutomatedBidding entity);
        void AddAutoBidding(AutomatedBidding entity);
        void AddBiddingHistory(BiddingHistory entity);
        void AddComment(Comment entity);
        Task<BlackList?> GetBlackListAsync(Guid userId,Guid productId, CancellationToken cancellationToken);
       
    }
}

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
        Task<Product?> GetProductAsyncById(Guid id, CancellationToken cancellationToken);

        Task<Product?> GetProductForPlaceBid(Guid id, CancellationToken cancellationToken);
        Task<AutomatedBidding?> GetAutoBidding(Guid userId, Guid productId, CancellationToken cancellationToken);
        void UpdateAutoBidding(AutomatedBidding entity);
        void AddAutoBidding(AutomatedBidding entity);
        void AddBiddingHistory(BiddingHistory entity);
        void AddComment(Comment entity);
        Task<BlackList?> GetBlackListAsync(Guid userId,Guid productId, CancellationToken cancellationToken);
        void DeleteBlackList(BlackList entity);
        void AddBlackList(BlackList entity);

        Task<BlackList?> GetBlackListById(Guid id, CancellationToken cancellationToken);
        Task RemoveBidderData(Guid bidderId, Guid productId, CancellationToken cancellationToken);
        Task<bool> IsSellerOfProductAsync(Guid productId, Guid sellerId, CancellationToken cancellationToken);
        Task<Watchlist?> GetWatchList(Guid userId, Guid productId, CancellationToken cancellationToken);
        void DeleteWatchList(Watchlist entity);
        void AddWatchList(Watchlist entity);
        Task<List<Watchlist>> GetLikedProducts(Guid userId, CancellationToken cancellationToken);
        IQueryable<Product> GetTopProducts();
        IQueryable<Product> SearchProducts(string searchTerms);
        IQueryable<Comment> GetComment();
        void DeleteComment(Comment comment);
        void AddRating(Rating rating);
        Task<bool> IsRatingExisting(Guid UserId, Guid RatedUserId, Guid ProductId, CancellationToken cancellationToken);
        Task<Rating?> GetRatingById(Guid id, CancellationToken cancellationToken);

    }
}

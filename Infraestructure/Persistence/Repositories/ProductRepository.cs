using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Persistence.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _appDbContext;
        public ProductRepository(ApplicationDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task AddProductAsync(Product entity,CancellationToken cancellationToken)
        {
            await _appDbContext.Products.AddAsync(entity,cancellationToken);
        }

        public async Task<Product?> GetProductDetails(Guid id, CancellationToken cancellationToken)
        {
            return await _appDbContext.Products
                .AsNoTracking()
                .Include(p => p.Seller)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.BiddingHistories)
                    .ThenInclude(b => b.Bidder)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .Include(p => p.Blacklists)
                    .ThenInclude(b => b.Bidder)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, cancellationToken);
        }


        public async Task<Product?> GetProductForPlaceBid(Guid id, CancellationToken cancellationToken)
        {
            // 1) Load product (không Include các collection)
            var product = await _appDbContext.Products
                .Include( p=> p.AutomatedBiddings.OrderByDescending(a=>a.MaxBidAmount).ThenBy(a=>a.CreatedAt).Take(1))
                .Include( p => p.BiddingHistories.OrderByDescending(o => o.BidAmount).ThenBy(a => a.CreatedAt).Take(1))
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

            return product;
        }


        public async Task<List<Product>> GetProductsForSeller(Guid sellerId, CancellationToken cancellationToken)
        {
            return await _appDbContext.Products
                .Include( p=> p.Category)
                .Include( p=> p.Images.Where( i => i.IsMain == true) )
                .Include(p => p.BiddingHistories.OrderByDescending(o => o.BidAmount).ThenBy(a => a.CreatedAt).Take(1))
                .Where(p => p.SellerId == sellerId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<Product?> GetProductWithImagesAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _appDbContext.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        }
        public async Task UpdateAsync(Product entity, CancellationToken cancellationToken)
        {
            _appDbContext.Products.Update(entity);
            await Task.CompletedTask; 
        }
        public async Task<AutomatedBidding?> GetAutoBidding(Guid userId, Guid productId, CancellationToken cancellationToken)
        {
            return await _appDbContext.AutomatedBiddings
                .AsNoTracking()
                .FirstOrDefaultAsync(ab =>
                    ab.BidderId == userId &&
                    ab.ProductId == productId,
                    cancellationToken
                );
        }

        public void UpdateAutoBidding(AutomatedBidding entity)
        {
            _appDbContext.Update(entity);
        }

        public void AddAutoBidding(AutomatedBidding entity)
        {
            _appDbContext.Add(entity);
        }

        public void AddBiddingHistory(BiddingHistory entity)
        {
            _appDbContext.Add(entity);
        }

        public void AddComment(Comment entity)
        {
            _appDbContext.Add(entity);
        }

        public async Task<BlackList?> GetBlackListAsync(Guid userId, Guid productId, CancellationToken cancellationToken)
        {
            return await _appDbContext.Blacklists
                .Where(bl => bl.BidderId == userId || bl.ProductId == productId)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public void DeleteBlackList(BlackList entity)
        {
            _appDbContext.Blacklists.Remove(entity);
        }

        public async Task<BlackList?> GetBlackListById(Guid id, CancellationToken cancellationToken)
        {
            return await _appDbContext.Blacklists.FindAsync(id);
        }
    }
}

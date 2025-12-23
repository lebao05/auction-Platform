using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Threading;

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
        public void AddBlackList(BlackList entity)
        {
            _appDbContext.Add(entity);
        }
        public async Task<BlackList?> GetBlackListAsync(Guid userId, Guid productId, CancellationToken cancellationToken)
        {
            return await _appDbContext.Blacklists
                .Where(bl => bl.BidderId == userId && bl.ProductId == productId)
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
        public async Task RemoveBidderData(Guid bidderId, Guid productId, CancellationToken cancellationToken)
        {
            var histories = await _appDbContext.BiddingHistories
                .Where(b => b.BidderId == bidderId && b.ProductId == productId)
                .ToListAsync(cancellationToken);

            _appDbContext.BiddingHistories.RemoveRange(histories);

            var autoBidding = await _appDbContext.AutomatedBiddings
                .FirstOrDefaultAsync(b => b.BidderId == bidderId && b.ProductId == productId, cancellationToken);

            if (autoBidding != null)
            {
                _appDbContext.AutomatedBiddings.Remove(autoBidding);
            }
        }
        public async Task<bool> IsSellerOfProductAsync(Guid productId, Guid sellerId, CancellationToken cancellationToken)
        {
            return await _appDbContext.Products
                .AsNoTracking()
                .AnyAsync(p => p.Id == productId && p.SellerId == sellerId, cancellationToken);
        }

        public async Task<Product?> GetProductAsyncById(Guid id, CancellationToken cancellationToken)
        {
            return await _appDbContext.Products.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<Watchlist?> GetWatchList(Guid userId, Guid productId, CancellationToken cancellationToken)
        {
            return await _appDbContext.Watchlists.FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId, cancellationToken);
        }

        public void DeleteWatchList(Watchlist entity)
        {
            _appDbContext.Watchlists.Remove(entity);
        }
        public void AddWatchList(Watchlist entity)
        {
            _appDbContext.Watchlists.Add(entity);
        }
        public async Task<List<Watchlist>> GetLikedProducts(
            Guid userId,
            CancellationToken cancellationToken)
        {
            return await _appDbContext.Watchlists
                .AsNoTracking()
                .Where(w => w.UserId == userId && !w.Product.IsDeleted)
                .Include(w => w.Product)
                    .ThenInclude(p => p.Images)
                .Include(w => w.Product)
                    .ThenInclude(p => p.Seller)
                .Include(w => w.Product)
                    .ThenInclude(p => p.BiddingHistories
                        .OrderByDescending(b => b.CreatedAt)
                        .Take(1))
                        .ThenInclude(b => b.Bidder)
                .ToListAsync(cancellationToken);
        }
        public IQueryable<Product> GetTopProducts()
        {
            return _appDbContext.Products
                .Where(p => !p.IsDeleted)
                .Include(p => p.Seller)
                .Include(p => p.Category)
                .Include(p => p.Images.Where(i => i.IsMain))
                .Include(p => p.BiddingHistories
                    .OrderByDescending(b => b.BidAmount)
                    .ThenBy(b => b.CreatedAt)
                    .Take(1))
                    .ThenInclude(b => b.Bidder);
        }
        public IQueryable<Product> SearchProducts(string searchTerms)
        {
            // Raw SQL query for Full-Text Search
            return _appDbContext.Products
                .FromSqlRaw(@"
                    SELECT *
                    FROM Products
                    WHERE FREETEXT((Name, Description), {0})
                      AND IsDeleted = 0", searchTerms)
                .Include(p => p.Seller)
                .Where(p => !p.IsDeleted)
                .Include(p => p.Category)
                .Include(p => p.Images.Where(i => i.IsMain))
                .Include(p => p.BiddingHistories
                    .OrderByDescending(b => b.BidAmount)
                    .ThenBy(b => b.CreatedAt)
                    .Take(1))
                    .ThenInclude(b => b.Bidder);
        }
    }
}

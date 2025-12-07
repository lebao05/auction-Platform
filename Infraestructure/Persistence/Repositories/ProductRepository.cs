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

        public async Task<List<Product>> GetProductsForSeller(Guid sellerId, CancellationToken cancellationToken)
        {
            return await _appDbContext.Products
                .Include( p=> p.Category)
                .Include( p=> p.Images.Where( i => i.IsMain == true) )
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
    }
}

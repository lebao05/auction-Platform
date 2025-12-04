using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Persistence.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public void AddCategory(Category category)
        {
            _context.Categories.Add(category);
        }

        public void DeleteCategory(Category category)
        {
            _context.Categories.Remove(category);
        }

        public async Task<List<Category>> GetAllCategoriesWithParent(CancellationToken cancellationToken = default)
        {
            return await _context.Categories.Include( c=> c.Parent ).ToListAsync(cancellationToken);
        }

        public async Task<Category?> GetCategoryById(Guid id, CancellationToken cancellationToken = default)
        {
           return await _context.Categories.FindAsync(id, cancellationToken);
        }
        public async Task<bool> HasAnyProductInSubtree(Guid categoryId, CancellationToken cancellationToken = default)
        {
            return await _context.Products.AnyAsync(p =>
                   p.CategoryId == categoryId ||
                   p.Category.ParentId == categoryId,cancellationToken
               );
        }
        public async Task<Category?> GetCategoryWithChilrens(Guid categoryId, CancellationToken cancellationToken = default)
        {
            return await _context.Categories
                .Include(c => c.Children)
                .FirstOrDefaultAsync(c => c.Id == categoryId, cancellationToken);
        }
        public async Task RemoveRangeAsync(IEnumerable<Category> categories)
        {
            _context.Categories.RemoveRange(categories);
            await Task.CompletedTask; 
        }
    }
}

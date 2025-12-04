using Domain.Entities;
namespace Domain.Repositories
{
    public interface ICategoryRepository 
    {
        void AddCategory(Category category);
        Task<Category?> GetCategoryById(Guid id, CancellationToken cancellationToken = default);
        Task<List<Category>> GetAllCategoriesWithParent(CancellationToken cancellationToken = default);
        Task<bool> HasAnyProductInSubtree(Guid categoryId, CancellationToken cancellationToken = default);
        void DeleteCategory(Category category);
        Task<Category?> GetCategoryWithChilrens(Guid categoryId, CancellationToken cancellationToken = default);
        Task RemoveRangeAsync(IEnumerable<Category> categories);
    }
}

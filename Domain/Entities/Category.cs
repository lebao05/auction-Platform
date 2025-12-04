using Domain.Common;
using Domain.Shared;

namespace Domain.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; private set; } = string.Empty;
        public Guid? ParentId { get; private set; }
        public Category? Parent { get; private set; }
        public ICollection<Category> Children { get; set; } = new List<Category>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public IReadOnlyCollection<Category> GetChildrens() => (IReadOnlyCollection<Category>)Children;
        public IReadOnlyCollection<Product> GetProducts() => (IReadOnlyCollection<Product>)Products;
        public static Category CreateCategory(string name, Guid? parentId = null)
        {
            return new Category
            {
                Id = Guid.NewGuid(),
                Name = name,
                ParentId = parentId,
                CreatedAt = DateTime.UtcNow
            };
        }
        public Result Update(string Name,Guid? parentId = null)
        {
            if( string.IsNullOrWhiteSpace(Name) )
                return Result.Failure(new Error("Category.Update", "Category name can not be empty"));
            this.Name = Name;
            this.ParentId = parentId;
            this.UpdatedAt = DateTime.UtcNow;
            return Result.Success();
        }
    }
}

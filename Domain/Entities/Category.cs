using Domain.Common;

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
        public Category CreateCateGory(string name, Guid? parentId = null)
        {
            return new Category
            {
                Id = Guid.NewGuid(),
                Name = name,
                ParentId = parentId
            };
        }
    }
}

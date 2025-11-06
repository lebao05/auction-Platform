using Domain.Common;

namespace Domain.Entities
{
    public class ProductDescriptionHistory : BaseEntity
    {
        public string Description { get; set; } = string.Empty;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}

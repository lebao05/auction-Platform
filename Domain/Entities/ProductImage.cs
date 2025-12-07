using Domain.Common;

namespace Domain.Entities
{
    public class ProductImage : BaseEntity
    {
        public string? ImageUrl { get; private set; } = string.Empty;

        public Guid ProductId { get; private set; }
        public Product Product { get; private set; } = null!;

        public bool IsMain { get; private set; } = false;

        public static ProductImage Create(Product product, string? imageUrl, bool isMain = false)
        {
            return new ProductImage
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                Product = product,
                ImageUrl = imageUrl,
                IsMain = isMain
            };
        }

        public void UpdateUrl(string imageUrl)
        {
            ImageUrl = imageUrl;
        }
    }
}

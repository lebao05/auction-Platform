using Domain.Common;
using Domain.DomainEvents;
namespace Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public long? BuyNowPrice { get; set; }
        public long StartPrice { get; set; }
        public long StepPrice { get; set; }
        public bool AllowAll { get; set; } = true;
        public int BiddingCount { get; set; } = 0;
        public long CurrentMaxBidAmount { get; set; }
        public bool IsAutoRenewal { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid SellerId { get; set; }
        public AppUser Seller { get; set; } = null!;
        public Guid? CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public bool IsDeleted { get; set; } = false;
        public string Description { get; set; } = null!;

        // Navigation Properties
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<BiddingHistory> BiddingHistories { get; set; } = new List<BiddingHistory>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<BlackList> Blacklists { get; set; } = new List<BlackList>();
        public static Product Create(
          string name,
          long? buyNowPrice,
          bool allowAll, 
          bool isAutoRenewal,
          long startPrice,
          long stepPrice,
          string description,
          int hours,
          AppUser seller,
          Guid? categoryId)
        {
            return new Product
            {
                Id = Guid.NewGuid(),
                Name = name,
                BuyNowPrice = buyNowPrice,
                AllowAll = allowAll,
                StartDate = DateTime.UtcNow,
                Description = description,
                EndDate = DateTime.UtcNow.AddHours(hours),
                SellerId = seller.Id,
                IsAutoRenewal = isAutoRenewal,
                Seller = seller,
                CategoryId = categoryId,
                StepPrice = stepPrice,
                StartPrice = startPrice,
            };
        }
        public void AddImages(List<string> imagePaths, int main = -1)
        {
            var createdImageIds = new List<Guid>();

            for (int i = 0; i < imagePaths.Count; i++)
            {
                bool isMain = (i == main); // mark the main image
                var productImage = ProductImage.Create(this, null , isMain);
                Images.Add(productImage);
                createdImageIds.Add(productImage.Id);
            }

            var @event = new ProductImagesCreatedEvent(this.Id, createdImageIds, imagePaths);
            AddDomainEvent(@event);
        }
    }
}

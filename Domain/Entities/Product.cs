using Domain.Common;
using Domain.DomainEvents;
using Domain.Enums;
namespace Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Name_NoAccent { get; set; } = string.Empty;

        public long? BuyNowPrice { get; set; }
        public long StartPrice { get; set; }
        public long StepPrice { get; set; }
        public bool AllowAll { get; set; } = true;
        public int BiddingCount { get; set; } = 0;
        public bool IsAutoRenewal { get; set; }
        public string Description_NoAccent { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid SellerId { get; set; }
        public AppUser Seller { get; set; } = null!;
        public Guid? CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public bool IsDeleted { get; set; } = false;
        public string Description { get; set; } = null!;

        // Buyer info

        public string? ShippingAddress { get; set; } = string.Empty;
        public string? PaymentInvoiceUrl { get; set; } = string.Empty;
        public string? ShippingPhone { get; set; } = string.Empty;


        // Seller info
        public string ShippingInvoiceUrl { get; set; } = string.Empty;
        //winner
        public Guid? Winnerid { get; set; }
        public AppUser? Winner { get; set; }

        public OrderStatus OrderStatus { get; set; } = OrderStatus.WaitingForPayment;
        // Navigation Properties
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<BiddingHistory> BiddingHistories { get; set; } = new List<BiddingHistory>();
        public ICollection<AutomatedBidding> AutomatedBiddings { get; set; } = new List<AutomatedBidding>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<BlackList> Blacklists { get; set; } = new List<BlackList>();
        public ICollection<Watchlist> Watchlists { get; private set; } = new List<Watchlist>();
        public ICollection<Rating> Ratings { get; private set; } = new List<Rating>();

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
                var productImage = ProductImage.Create(this, null, isMain);
                Images.Add(productImage);
                createdImageIds.Add(productImage.Id);
            }

            var @event = new ProductImagesCreatedEvent(this.Id, createdImageIds, imagePaths);
            AddDomainEvent(@event);
        }
        public void AddDesciption(string desciption)
        {
            this.Description += desciption;
        }
        public void EndByBuyNow(Guid winnerId)
        {
            EndDate = DateTime.UtcNow;
            Winnerid = winnerId;

            AddDomainEvent(
                new ProductEndedDomainEvent(
                    Id,
                    SellerId,
                    winnerId
                )
            );
        }
        public void EndByTime()
        {
            AddDomainEvent(
                new ProductEndedDomainEvent(
                    Id,
                    SellerId,
                    Winnerid
                )
            );
        }
        public void BlacklistBidder(Guid bidderId)
        {
            AddDomainEvent(new BidderBlacklistedDomainEvent(
                productId: Id,
                sellerId: SellerId,
                bidderId: bidderId));
        }
        public void AskQuestion(Comment comment)
        {
            AddDomainEvent(new BuyerAskedQuestionDomainEvent(
                productId: comment.ProductId,
                questionId: comment.Id,
                buyerId: comment.UserId));
        }
        public void ReplyToQuestion(Comment comment)
        {
            AddDomainEvent(new SellerRepliedToQuestionDomainEvent(
                productId: comment.ProductId,
                questionId: comment.Id,
                sellerId: SellerId));
        }
        public void PlaceBid(long bidPrice,Guid? PreviosBidder,Guid TopBidder)
        {
       

            AddDomainEvent(new BidPlacedSuccessfullyDomainEvent(
                productId: Id,
                sellerId: SellerId,
                newBidderId: TopBidder,
                previousBidderId: PreviosBidder,
                newPrice: bidPrice));
        }

    }
}

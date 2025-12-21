using Domain.Common;

namespace Domain.Entities
{
    public class Watchlist : BaseEntity
    {
        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public static Watchlist CreateWatchList(Guid userId, Guid productId)
        {
            return new Watchlist
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ProductId = productId
            };
        }
    }
}

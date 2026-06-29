using Domain.Common;

namespace Domain.Entities
{
    public class Watchlist : BaseEntity
    {
        public Guid UserId { get; private set; }
        public AppUser User { get; private set; } = null!;

        public Guid ProductId { get; private set; }
        public Product Product { get; private set; } = null!;

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

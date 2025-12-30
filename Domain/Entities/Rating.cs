using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Rating : BaseEntity
    {
        // EF Core needs a parameterless ctor
        private Rating() { }

        public Rating(
            RatingType ratingType,
            string? comment,
            Guid productId,
            Guid raterId,
            Guid ratedUserId)
        {
            RatingType = ratingType;
            Comment = comment?.Trim() ?? string.Empty;
            ProductId = productId;
            RaterId = raterId;
            RatedUserId = ratedUserId;
        }

        public RatingType RatingType { get; private set; }
        public string? Comment { get; private set; } = string.Empty;

        public Guid ProductId { get; private set; }
        public Product Product { get; private set; } = null!;

        public Guid RaterId { get; private set; }
        public AppUser Rater { get; private set; } = null!;

        public Guid RatedUserId { get; private set; }
        public AppUser RatedUser { get; private set; } = null!;

        public void UpdateRating(RatingType ratingType, string? comment)
        {
            RatingType = ratingType;
            Comment = comment?.Trim() ?? string.Empty;
        }
    }
}

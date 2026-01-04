using Domain.Enums;

namespace Application.Product.Queries.GetRatings
{
    public class GetRatingResponse
    {
        public Guid Id { get; init; }

        public RatingType RatingType { get; init; }
        public string? Comment { get; init; }

        public Guid ProductId { get; init; }

        // Rater (who gives the rating)
        public Guid RaterId { get; init; }
        public string RaterName { get; init; } = string.Empty;
        public string? RaterAvatarUrl { get; init; }

        // Rated user (who receives the rating)
        public Guid RatedUserId { get; init; }
        public string RatedUserName { get; init; } = string.Empty;
        public string? RatedUserAvatarUrl { get; init; }


        public DateTime CreatedAt { get; init; }
    }
}

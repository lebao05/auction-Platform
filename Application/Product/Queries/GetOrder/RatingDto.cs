using Domain.Enums;

namespace Application.Product.Queries.GetOrder
{
    public class RatingDto
    {
        public Guid Id { get; set; }
        public RatingType RatingType { get; set; }
        public string? Comment { get; set; }

        public Guid RaterId { get; set; }
        public string RaterName { get; set; } = string.Empty;
        public string? RaterAvatarUrl { get; set; }


        public Guid RatedUserId { get; set; }
        public string RatedUserName { get; set; } = string.Empty;
        public string? RatedUserAvatarUrl { get; set; }
    }
}

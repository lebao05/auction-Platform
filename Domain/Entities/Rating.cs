using Domain.Common;
using Domain.Enums;
namespace Domain.Entities
{
    public class Rating : BaseEntity
    {
        public RatingType RatingType { get; set; }
        public string Comment { get; set; } = string.Empty;

        public Guid RaterId { get; set; }
        public AppUser Rater { get; set; } = null!;

        public Guid RatedUserId { get; set; }
        public AppUser RatedUser { get; set; } = null!;
    }
}

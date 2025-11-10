using Domain.Common;
using Domain.Enums;
namespace Domain.Entities
{
    public class Rating : BaseEntity
    {
        public int RatingId { get; set; }
        public RatingType RatingType { get; set; }
        public string Comment { get; set; } = string.Empty;

        public int RaterId { get; set; }
        public User Rater { get; set; } = null!;

        public int RatedUserId { get; set; }
        public User RatedUser { get; set; } = null!;

        public int? ProductId { get; set; }
        public Product? Product { get; set; }
    }
}

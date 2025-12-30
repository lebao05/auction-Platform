
using Domain.Enums;

namespace Presentation.Contracts.Rating
{
    public class UpdateRatingRequest
    {
        public string? Comment { get; set; }
        public RatingType RatingType { get; set; }
    }
}

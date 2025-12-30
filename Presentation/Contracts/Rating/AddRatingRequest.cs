using Domain.Enums;

namespace Presentation.Contracts.Rating
{
    public class AddRatingRequest
    {
        public RatingType RatingType { get; set; }
        public string? Comment { get; set; }
    }
}

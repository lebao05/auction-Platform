using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Product.Commands.UpdateRating
{
    public sealed record UpdateRatingCommand(Guid UserId, Guid RatingId, string? Comment, RatingType RatingType) : ICommand;
}

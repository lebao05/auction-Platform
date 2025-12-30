using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Product.Commands.AddRating
{
    public sealed record AddRatingCommand(Guid Userid, Guid ProductId, RatingType RatingType, string? Comment) : ICommand;
}

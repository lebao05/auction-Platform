using Application.Abstractions.Messaging;

namespace Application.Product.Queries.GetRatings
{
    public sealed record GetRatingsQuery(Guid UserID,Guid? ViewerId) : IQuery<List<GetRatingResponse>>;
}

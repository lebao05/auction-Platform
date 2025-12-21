using Application.Abstractions.Messaging;

namespace Application.Product.Queries.GetWachtList
{
    public sealed record GetWatchListQuery(Guid userId) : IQuery<List<GetWatchListResponse>>;
}

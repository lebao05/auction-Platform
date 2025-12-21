using Application.Abstractions.Messaging;
using MediatR;

namespace Application.Product.Queries.GetTopBiddingCountProducts
{
    public sealed record GetTopBiddingCountProductsQuery(
        int PageIndex = 1,
        int PageSize = 8
    ) : IQuery<List<GetTopProductsDto>>;
}

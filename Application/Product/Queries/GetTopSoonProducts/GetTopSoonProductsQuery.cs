using Application.Abstractions.Messaging;
using Application.Product.Queries.GetTopBiddingCountProducts;

namespace Application.Product.Queries.GetTopSoonProducts
{
    public sealed record GetTopSoonProductsQuery(
        int PageIndex = 1,
        int PageSize = 8
    ) : IQuery<List<GetTopProductsDto>>;
}

using Application.Abstractions.Messaging;
using Application.Product.Queries.GetTopBiddingCountProducts;
namespace Application.Product.Queries.GetTopValueProducts
{
    public sealed record GetTopValueProductsQuery(
        int PageIndex = 1,
        int PageSize = 8
    ) : IQuery<List<GetTopProductsDto>>;
}

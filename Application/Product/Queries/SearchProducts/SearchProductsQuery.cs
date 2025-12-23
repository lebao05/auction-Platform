using Application.Abstractions.Messaging;
using Application.Product.Queries.GetTopBiddingCountProducts;

namespace Application.Product.Queries.SearchProducts
{
    public sealed record SearchProductsQuery(
        string? SearchTerm = null,
        Guid? CategoryId = null,
        int PageIndex = 1,
        int PageSize = 8,
        string? SortBy = "EndDate") : IQuery<List<GetTopProductsDto>>;
}

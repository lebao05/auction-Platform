using Application.Abstractions.Messaging;

namespace Application.Product.Queries.GetProductsForSeller
{
    public sealed record GetProductsForSellerQuery(Guid sellerId) : IQuery<List<GetProductsForSellerResponse>>
    {
    }
}

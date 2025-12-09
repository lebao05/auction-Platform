using Application.Abstractions.Messaging;

namespace Application.Product.Queries.GetProductDetails
{
    public sealed record GetProductDetailsQuery(Guid? userId,Guid productId) : IQuery<GetProductDetailsResponse>;
}

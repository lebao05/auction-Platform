using Application.Abstractions.Messaging;

namespace Application.Product.Queries.GetOrder
{
    public sealed record GetOrderQuery(Guid UserId,Guid ProductId) : IQuery<GetOrderResponse>;
}

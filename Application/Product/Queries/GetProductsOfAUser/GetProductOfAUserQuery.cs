using Application.Abstractions.Messaging;

namespace Application.Product.Queries.GetProductsOfAUser
{
    public sealed record GetProductOfAUserQuery(Guid? ViewerId,Guid UserId):IQuery<GetProductOfAUserResponse>;
}

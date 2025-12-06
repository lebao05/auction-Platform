using Application.Abstractions.Messaging;

namespace Application.User.Queries.GetSellerRequest
{
    public sealed record GetSellerRequestQuery(Guid userId) : ICommand<GetSellerRequestResponse>;
}

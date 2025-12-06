using Domain.Enums;

namespace Application.User.Queries.GetSellerRequest
{
    public sealed record GetSellerRequestResponse(Guid Id,RequestStatus Status,DateTime CreatedAt);
}

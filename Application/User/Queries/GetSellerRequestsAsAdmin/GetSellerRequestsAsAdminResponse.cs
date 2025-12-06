using Domain.Enums;

namespace Application.User.Queries.GetSellerRequestsAsAdmin
{
    public sealed record GetSellerRequestsAsAdminResponse(
            Guid Id,
            string FullName,
            string email,
            RequestStatus Status,
            DateTime CreatedAt
       );
}

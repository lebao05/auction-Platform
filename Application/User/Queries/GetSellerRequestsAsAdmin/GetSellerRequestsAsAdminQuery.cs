using Application.Abstractions.Messaging;

namespace Application.User.Queries.GetSellerRequestsAsAdmin
{
    public sealed record GetSellerRequestsAsAdminQuery(string[] userNames,int pageNumber, bool createdDecsending) : IQuery<List<GetSellerRequestsAsAdminResponse>>;
}

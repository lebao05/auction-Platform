using Application.Abstractions.Messaging;

namespace Application.User.Queries.GetAllUsers
{
    public sealed record GetAllUsersQuery() : IQuery<List<GetAllUsersResponse>>;
}

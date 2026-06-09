using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.User.Queries.GetAllUsers
{
    public class GetAllUsersQueryHandler : IQueryHandler<GetAllUsersQuery, List<GetAllUsersResponse>>
    {
        private readonly IUserRepository _userRepository;
        public GetAllUsersQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<Result<List<GetAllUsersResponse>>> Handle(
            GetAllUsersQuery request,
            CancellationToken cancellationToken)
        {
            var users = await _userRepository.GetAllUsers(cancellationToken);

            var responses = new List<GetAllUsersResponse>(users.Count);

            foreach (var s in users)
            {
                var isSeller = await _userRepository.IsUserSeller(s.Id, cancellationToken);

                responses.Add(new GetAllUsersResponse
                {
                    Id = s.Id,
                    FullName = s.FullName,
                    Email = s.Email!,
                    CreatedAt = s.CreatedAt,
                    Role = isSeller ? "Seller" : "Buyer"
                });
            }

            return Result.Success(responses);
        }
    }
}

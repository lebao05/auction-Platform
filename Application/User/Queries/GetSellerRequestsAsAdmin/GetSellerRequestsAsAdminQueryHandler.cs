using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.User.Queries.GetSellerRequestsAsAdmin
{
    public class GetSellerRequestsAsAdminQueryHandler : IQueryHandler<GetSellerRequestsAsAdminQuery, List<GetSellerRequestsAsAdminResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<GetSellerRequestsAsAdminQueryHandler> _logger;

        public GetSellerRequestsAsAdminQueryHandler(
            IUserRepository userRepository,
            ILogger<GetSellerRequestsAsAdminQueryHandler> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<Result<List<GetSellerRequestsAsAdminResponse>>> Handle(GetSellerRequestsAsAdminQuery request, CancellationToken cancellationToken)
        {

            int pageSize = 20;

            var result = await _userRepository.GetSellerRequestsWithQuery(
                request.userNames,
                request.pageNumber,
                pageSize,
                request.createdDecsending,
                cancellationToken
            );


            var dtos = result.Select(rq => new GetSellerRequestsAsAdminResponse(
                rq.Id,
                rq.User.FullName,
                rq.User.Email!,
                rq.Status,
                rq.CreatedAt
            )).ToList();


            return Result<List<GetSellerRequestsAsAdminResponse>>.Success(dtos);
        }
    }
}

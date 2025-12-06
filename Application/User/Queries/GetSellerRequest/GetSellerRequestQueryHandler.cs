using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.User.Queries.GetSellerRequest
{
    // Ensure GetSellerRequestQuery implements ICommand<GetSellerRequestResponse>
    // and IRequest<Result<GetSellerRequestResponse>> in its definition.
    public class GetSellerRequestQueryHandler : ICommandHandler<GetSellerRequestQuery, GetSellerRequestResponse>
    {
        private readonly IUserRepository _userRepository;
        public GetSellerRequestQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<Result<GetSellerRequestResponse>> Handle(GetSellerRequestQuery request, CancellationToken cancellationToken)
        {
            var sellerRequest = await _userRepository.GetSellerRequest(request.userId, cancellationToken);
            if (sellerRequest == null)
            {
                return Result.Failure<GetSellerRequestResponse>(
                    new Error("GetSellerRequest.NotFound", "Seller request not found")
                );
            }
            var response = new GetSellerRequestResponse(
                sellerRequest.Id,
                sellerRequest.Status,
                sellerRequest.CreatedAt
            );
            return Result.Success(response);
        }
    }
}

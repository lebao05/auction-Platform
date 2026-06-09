using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.User.Queries.GetProfile
{
    public class GetProfileCommandHandler : ICommandHandler<GetProfileCommand, GetProfileResponseDto?>
    {
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        public GetProfileCommandHandler(IUserRepository userRepostory,
            IProductRepository productRepository    )
        {
            _userRepository = userRepostory;
            _productRepository = productRepository;
        }
        public async Task<Result<GetProfileResponseDto?>> Handle(GetProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserById(request.userId, cancellationToken);
            if (user == null)
            {
                return Result.Failure<GetProfileResponseDto?>(new Domain.Shared.Error("User.NotFound", "User not found."));
            }
            var averageRating = await _productRepository.GetUserRatingPercentAsync(user.Id, cancellationToken);
            var responseDtoNoRatings = new GetProfileResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth,
                AverageRating = averageRating,
            };
            return Result.Success<GetProfileResponseDto?>(responseDtoNoRatings);
        }
    }
}

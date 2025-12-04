using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.User.Queries.GetProfile
{
    public class GetProfileCommandHandler : ICommandHandler<GetProfileCommand, GetProfileResponseDto?>
    {
        private readonly IUserRepository _userRepository;
        public GetProfileCommandHandler(IUserRepository userRepostory)
        {
            _userRepository = userRepostory;
        }
        public async Task<Result<GetProfileResponseDto?>> Handle(GetProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserById(request.userId, cancellationToken);
            if (user == null)
            {
                return Result.Failure<GetProfileResponseDto?>(new Domain.Shared.Error("User.NotFound", "User not found."));
            }
            var responseDtoNoRatings = new GetProfileResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth,
            };
            return Result.Success<GetProfileResponseDto?>(responseDtoNoRatings);
        }
    }
}

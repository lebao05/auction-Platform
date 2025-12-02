using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;
using MediatR;

namespace Application.User.Commands.RequestSeller
{


    public class RequestSellerCommandHandler : ICommandHandler<RequestSellerCommand>
    {
        private readonly IUserRepository _userRepository;
        public RequestSellerCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<Result> Handle(RequestSellerCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserById(request.userId,cancellationToken);
            if( user == null) {
                return Result.Failure(new Error("AppUser.RequestSeller", "User not found"));

        }
    }
}

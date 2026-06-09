using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.User.Commands.BanUser
{
    public class BanUserCommandHandler : ICommandHandler<BanUserCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        public BanUserCommandHandler(IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
        }
        public async Task<Result> Handle(BanUserCommand request, CancellationToken cancellationToken)
        {
            var userToBan = await _userRepository.GetUserById(request.UserId, cancellationToken);
            if (userToBan is null)
            {
                return Result.Failure(new Error("User.NotFound", "The user was not found."));
            }
            userToBan.IsBanned = true;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

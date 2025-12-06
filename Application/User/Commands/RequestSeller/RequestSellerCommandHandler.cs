using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using Domain.Shared;
using MediatR;

namespace Application.User.Commands.RequestSeller
{


    public class RequestSellerCommandHandler : ICommandHandler<RequestSellerCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        public RequestSellerCommandHandler(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
        }
        public async Task<Result> Handle(RequestSellerCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserWithSellerRequest(request.userId, cancellationToken);

            if (user == null)
            {
                return Result.Failure(new Error("AppUser.RequestSeller", "User not found"));
            }
            var firstRq = user.SellerRequests.FirstOrDefault();
            // Already has a request?
            if (firstRq != null)
            {
                if (firstRq.Status == RequestStatus.Approved)
                {
                    return Result.Failure(new Error("AppUser.RequestSeller", "You already are a seller"));
                }

                if (firstRq.Status == RequestStatus.Pending)
                {
                    return Result.Failure(new Error("AppUser.RequestSeller", "You already sent a request"));
                }

                // Rejected case → must wait 14 days
                int daysPassed = (DateTime.UtcNow - firstRq.CreatedAt).Days;

                if (daysPassed < 14)
                {
                    int daysLeft = 14 - daysPassed;
                    return Result.Failure(
                        new Error("AppUser.RequestSeller", $"You were rejected. Please wait {daysLeft} more days")
                    );
                }
            }

            SellerRequest newRequest = new SellerRequest().CreateaSellerRequest(Guid.NewGuid(), request.userId);
            _userRepository.AddSellerRequest(newRequest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

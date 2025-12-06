using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.User.Commands.AcceptSellerRequest
{
    public class HandleSellerCommandHandler : ICommandHandler<HandleSellerCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<HandleSellerCommandHandler> _logger;

        public HandleSellerCommandHandler(
            IUserRepository userRepository,
            UserManager<AppUser> userManager,
            ILogger<HandleSellerCommandHandler> logger,
            IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<Result> Handle(HandleSellerCommand request, CancellationToken cancellationToken)
        {
            // 1. Load seller request
            var sellerRequest = await _userRepository.GetSellerRequestById(request.SellerRequestId, cancellationToken);
            if (sellerRequest == null)
            {
                _logger.LogWarning("Seller request {Id} not found", request.SellerRequestId);
                return Result.Failure(new Error(
                    "SellerRequest.NotFound",
                    "There is no seller request with this ID"));
            }

            // 2. Mark request handled
            sellerRequest.HandleRequest(request.IsAccepted);

            // 3. Load associated user
            var user = await _userManager.FindByIdAsync(sellerRequest.UserId.ToString());
            if (user == null)
            {
                _logger.LogError("User {UserId} not found for seller request {RequestId}",
                    sellerRequest.UserId, sellerRequest.Id);

                return Result.Failure(new Error(
                    "User.NotFound",
                    "User does not exist"));
            }

            // 4. If accepted → add Seller role
            if (request.IsAccepted)
            {
                if (!await _userManager.IsInRoleAsync(user, "Seller"))
                {
                    var roleResult = await _userManager.AddToRoleAsync(user, "Seller");
                    if (!roleResult.Succeeded)
                    {
                        _logger.LogError("Failed to assign Seller role to user {UserId}. Errors: {Errors}",
                            user.Id,
                            string.Join(", ", roleResult.Errors.Select(e => e.Description)));

                        return Result.Failure(new Error(
                            "Role.AddFailed",
                            "Failed to assign seller role to the user"));
                    }

                    _logger.LogInformation("Seller role assigned to user {UserId}", user.Id);
                }
            }
            else
            {
                _logger.LogInformation("Seller request {RequestId} rejected for user {UserId}", sellerRequest.Id, user.Id);
            }

            // 5. Save changes (your repository should track sellerRequest)
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}

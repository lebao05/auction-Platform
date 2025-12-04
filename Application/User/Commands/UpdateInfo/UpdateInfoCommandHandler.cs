using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.User.Commands.UpdateInfo;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

public class UpdateInfoCommandHandler : ICommandHandler<UpdateInfoCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;
    private readonly ILogger<UpdateInfoCommandHandler> _logger;

    public UpdateInfoCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateInfoCommandHandler> logger,
        UserManager<AppUser> userManager)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _userManager = userManager;
    }

    public async Task<Result> Handle(UpdateInfoCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUserById(request.userId);

        if (user == null)
        {
            return Result.Failure(new Error("AppUser.UpdatingInfo", "User with that userId not found"));
        }

        // Update Email first (DDD rule: aggregate owns its data)
        if (!string.IsNullOrWhiteSpace(request.email))
        {
            var otherUser = await _userRepository.GetUserByEmail(request.email, cancellationToken);
            if (otherUser != null && otherUser.Id != user.Id)
            {
                return Result.Failure(new Error("AppUser.EmailExists", "Email is already registered."));
            }
            user!.Email = request.email;
            user.NormalizedEmail = request.email.ToUpperInvariant();
            user.EmailConfirmed = false;
            user.UserName = request.email;
        }
        var updateResult = user.UpdateInfo(
            request.fullname,
            request.phoneNumber,
            request.address,
            request.avatarUrl,
            request.dateOfBirth
        );

        if (updateResult.IsFailure)
            return updateResult;

        _logger.LogInformation(
            "Updating user info: UserId={UserId}, FullName={FullName}, Phone={Phone}, Address={Address}, Avatar={Avatar}, DOB={Dob}",
            user.Id,
            user.FullName,
            user.PhoneNumber,
            user.Address,
            user.AvatarUrl,
            user.DateOfBirth
        );

        // Only UnitOfWork writes to DB
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

}

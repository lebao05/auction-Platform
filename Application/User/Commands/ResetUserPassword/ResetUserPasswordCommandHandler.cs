using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Application.User.Commands.ResetUserPassword
{
    public class ResetUserPasswordCommandHandler : ICommandHandler<ResetUserPasswordCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<Domain.Entities.AppUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        public ResetUserPasswordCommandHandler(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            UserManager<Domain.Entities.AppUser> userManager,
            IEmailService emailService)
        {
            _emailService = emailService;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }
        public async Task<Result> Handle(ResetUserPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserById(request.UserId,cancellationToken);
            if (user == null)
                return Result.Failure<string>(new Error("AppUser.NotFound", "Can't find a user with the Id"));
            var newPassword = PasswordGenerator.GenerateSecurePassword();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var result = await _userManager.ResetPasswordAsync(
                user,
                token,
                newPassword);

            if (!result.Succeeded)
            {
                var error = string.Join(
                    ", ",
                    result.Errors.Select(e => e.Description));

                return Result.Failure<string>(
                    new Error("Password.ResetFailed", error));
            }
            await _emailService.SendAsync(
                to: user.Email!,
                subject: "Your password has been reset",
                body: $"""
                        Hello {user.FullName},

                        Your password has been reset by an administrator.

                        Temporary password:
                        {newPassword}

                        Please log in and change your password immediately.
                        Regards,
                        """
            );

            return Result.Success(newPassword);

        }
    }
}

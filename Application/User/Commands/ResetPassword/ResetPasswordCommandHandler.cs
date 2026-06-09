using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Application.User.Commands.ResetPassword
{
    public class ResetPasswordCommandHandler
     : ICommandHandler<ResetPasswordCommand>
    {
        private readonly UserManager<AppUser> _userManager;

        public ResetPasswordCommandHandler(
            UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Result> Handle(
            ResetPasswordCommand request,
            CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user is null)
            {
                return Result.Failure(
                    new Error("OTP.Invalid", "Invalid OTP or email"));
            }

            var otpResult = user.VerifyForgotPasswordOtp(request.Otp);
            if (otpResult.IsFailure)
                return otpResult;

            // Reset password safely
            await _userManager.RemovePasswordAsync(user);
            var result = await _userManager.AddPasswordAsync(
                user, request.NewPassword);

            if (!result.Succeeded)
            {
                return Result.Failure(
                    new Error("Password.ResetFailed",
                        string.Join(", ",
                            result.Errors.Select(e => e.Description))));
            }

            user.ClearForgotPasswordOtp();
            await _userManager.UpdateAsync(user);

            return Result.Success();
        }
    }

}

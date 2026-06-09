using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Application.User.Commands.TriggerRestoringPassword
{
    internal class TriggerRestoringPasswordCommandHandler
     : ICommandHandler<TriggerRestoringPasswordCommand>
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailService _emailService;

        public TriggerRestoringPasswordCommandHandler(
            UserManager<AppUser> userManager,
            IEmailService emailService)
        {
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task<Result> Handle(
            TriggerRestoringPasswordCommand request,
            CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            // Security: do NOT reveal user existence
            if (user is null)
                return Result.Success();

            user.GenerateForgotPasswordOtp(TimeSpan.FromMinutes(10));
            await _userManager.UpdateAsync(user);

            await _emailService.SendAsync(
                request.Email,
                "Reset password OTP",
                $"Your OTP is: {user.GetPlainOtp()}");

            return Result.Success();
        }
    }

}

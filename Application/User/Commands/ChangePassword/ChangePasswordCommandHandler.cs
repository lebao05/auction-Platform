using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Application.User.Commands.ChangePassword
{
    public class ChangePasswordCommandHandler : ICommandHandler<ChangePasswordCommand>
    {
        private readonly UserManager<AppUser> _userManager;
        public ChangePasswordCommandHandler(
            UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }
        public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
                return Result.Failure<string>(new Error("AppUser.NotFound", "Can't find a user with the email"));
            await _userManager.ChangePasswordAsync(user,request.OldPassword, request.NewPassword);
            return Result.Success();
        }
    }
}

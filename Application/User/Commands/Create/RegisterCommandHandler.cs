using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User.Commands.Create
{
    public sealed class RegisterCommandHandler
        : ICommandHandler<RegisterCommand, string>
    {
        private readonly IUserHelper _userHelper;
        private readonly UserManager<AppUser> _userManager;
        public RegisterCommandHandler(IUserHelper userHelper, UserManager<AppUser> userManager)
        {
            _userHelper = userHelper;
            _userManager = userManager;
        }

        public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = new AppUser
            (
                request.username,
                request.email,
                request.email
            );

            var existingUser = await _userManager.FindByEmailAsync(request.email);
            if( existingUser != null)
            {
                return Result.Failure<string>(new Domain.Shared.Error("AppUser.EmailExists", "Email is already registered."));
            }
            var identityResult = await _userManager.CreateAsync(user, request.password);

            if (identityResult.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(user,"User");
                if( roleResult.Succeeded == false)
                {
                    await _userManager.DeleteAsync(user);
                    var errors = roleResult.Errors.Select(e => e.Description);
                    return Result.Failure<string>(new Domain.Shared.Error("AppUser.AssignRole", string.Join(", ", errors)));
                }
                return Result.Success(_userHelper.CreateJWTToken(user, new List<string> { "User" }));
            }

            var error = string.Join(',' ,identityResult.Errors.Select(e => e.Description));
            return Result.Failure<string>(new Domain.Shared.Error("AppUser.CreatingAccount", error)) ;
        }
    }
}

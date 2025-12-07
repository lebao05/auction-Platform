using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;
namespace Application.User.Commands.Login
{
    public sealed class LoginCommandHandler : ICommandHandler<LoginCommand, string>
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserHelper _userHelper;
        public LoginCommandHandler(UserManager<AppUser> userManager, IUserHelper userHelper)
        {
            _userManager = userManager;
            _userHelper = userHelper;
        }

        public async Task<Result<string>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.email);
            if (user == null) 
                return Result.Failure<string>(new Error("AppUser.NotFound","Can't find a user with the email"));
            bool isPasswordValid = await _userManager.CheckPasswordAsync(user, request.password);
            if( isPasswordValid! == false )
                return Result.Failure<string>(new Error("AppUser.InvalidPassword","The password is invalid"));
            var roles = await _userManager.GetRolesAsync(user);
            string token = _userHelper.CreateJWTToken(user,roles);
            return Result.Success(token);
        }
    }
}

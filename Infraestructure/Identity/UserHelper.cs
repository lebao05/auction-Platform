using Application.Abstractions;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infraestructure.Identity
{
    public class UserHelper : IUserHelper
    {
        private readonly UserManager<AppUser> _userManager;
        public UserHelper(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }
        public async Task<IdentityResult> CreateUserAsync(AppUser user,string password)
        {
            var result = await _userManager.CreateAsync(user, password);
            return result;
        }
    }
}

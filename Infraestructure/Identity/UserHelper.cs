using Application.Abstractions;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infraestructure.Identity
{
    public class UserHelper : IUserHelper
    {
        private readonly UserManager<User> _userManager;
        public UserHelper(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        public async Task<IdentityResult> CreateUserAsync(string fullname, string email, string password)
        {
            var user = new User
            {
                UserName = email,
                Email = email,
                FullName = fullname,
            };

            var result = await _userManager.CreateAsync(user, password);

            return result;
        }
    }
}

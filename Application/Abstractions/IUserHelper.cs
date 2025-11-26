using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Application.Abstractions
{
    public interface IUserHelper
    {
        public Task<IdentityResult> CreateUserAsync(AppUser user, string password);
    }
}

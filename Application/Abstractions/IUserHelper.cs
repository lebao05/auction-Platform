using Microsoft.AspNetCore.Identity;

namespace Application.Abstractions
{
    public interface IUserHelper
    {
        public Task<IdentityResult> CreateUserAsync(string fullname, string email, string password);
    }
}

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
namespace Infraestructure.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? string.Empty;
        }
    }
}


namespace Presentation.Contracts.User
{
    public record ResetPasswordRequest(
         string Email,
         string Otp,
         string NewPassword
     );
}

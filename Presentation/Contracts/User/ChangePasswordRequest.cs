namespace Presentation.Contracts.User
{
    public record ChangePasswordRequest(string OldPassword, string NewPassword);
}

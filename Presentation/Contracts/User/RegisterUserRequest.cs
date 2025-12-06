namespace Presentation.Contracts.User
{
    public sealed record RegisterUserRequest(
    string fullname,
    string email,
    string password,
    string address);
}

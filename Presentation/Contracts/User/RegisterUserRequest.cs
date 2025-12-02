namespace Presentation.Contracts.User
{
    public sealed record class RegisterUserRequest(
    string fullname,
    string email,
    string password,
    string address);

}

namespace Presentation.Contracts
{
    public sealed record class RegisterUserRequest(
    string fullname,
    string email,
    string password);

}

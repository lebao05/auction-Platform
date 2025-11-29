namespace Presentation.Contracts.User
{
    public sealed record LoginUserRequest(
        string email,
        string password);
}

using Application.Abstractions.Messaging;

namespace Application.User.Commands.UpdateInfo
{
    public sealed record UpdateInfoCommand(
        Guid userId,string fullname, string email, 
        string? phoneNumber,DateTime? dateOfBirth,
        string address,string? avatarUrl) : ICommand;
}

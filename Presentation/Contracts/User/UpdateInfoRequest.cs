using System;

namespace Presentation.Contracts.User
{
    public sealed record UpdateInfoRequest(
        string FullName,
        string Email,
        string? PhoneNumber,
        string Address,
        string? AvatarUrl,
        DateTime? DateOfBirth
    );
}

using Application.Abstractions.Messaging;

namespace Application.User.Queries.GetProfile
{
    public sealed record GetProfileCommand(Guid userId) : ICommand<GetProfileResponseDto?>
    {
    }
}

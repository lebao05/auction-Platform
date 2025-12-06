using Application.Abstractions.Messaging;
namespace Application.User.Commands.AcceptSellerRequest
{
    public sealed record HandleSellerCommand(Guid SellerRequestId,bool IsAccepted) : ICommand;
}

using Application.Abstractions.Messaging;
namespace Application.Product.Commands.PlaceBid
{
    public sealed record PlaceBidCommand(Guid userId, Guid productId,long maxBidAmount) : ICommand;
}

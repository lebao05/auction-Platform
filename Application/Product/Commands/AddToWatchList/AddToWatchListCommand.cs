using Application.Abstractions.Messaging;

namespace Application.Product.Commands.AddToWatchList
{
    public sealed record AddToWatchListCommand(Guid userId,Guid productId) : ICommand;
}

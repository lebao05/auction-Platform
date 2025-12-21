using Application.Abstractions.Messaging;

namespace Application.Product.Commands.DeleteFromWatchList
{
    public sealed record DeleteFromWatchListCommand(Guid userId,Guid productId) : ICommand;
}

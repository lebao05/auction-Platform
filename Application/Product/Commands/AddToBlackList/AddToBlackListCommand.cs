using Application.Abstractions.Messaging;

namespace Application.Product.Commands.AddToBlackList
{
    public sealed record AddToBlackListCommand(Guid SellerId,Guid BidderId,Guid ProductId) :
        ICommand<BlackListDto>;
}

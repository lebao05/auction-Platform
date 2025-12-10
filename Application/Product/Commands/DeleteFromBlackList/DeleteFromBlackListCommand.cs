using Application.Abstractions.Messaging;

namespace Application.Product.Commands.DeleteFromBlackList
{
    public sealed record DeleteFromBlackListCommand(Guid Id,Guid SellerId) : ICommand;
}

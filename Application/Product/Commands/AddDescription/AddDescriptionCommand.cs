using Application.Abstractions.Messaging;

namespace Application.Product.Commands.AddDescription
{
    public sealed record AddDescriptionCommand(Guid sellerId,Guid productId,string description)
    :ICommand;
}

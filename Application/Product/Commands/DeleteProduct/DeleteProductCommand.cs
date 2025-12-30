using Application.Abstractions.Messaging;

namespace Application.Product.Commands.DeleteProduct
{
    public sealed record DeleteProductCommand(Guid UserId,Guid ProductId) : ICommand;
}

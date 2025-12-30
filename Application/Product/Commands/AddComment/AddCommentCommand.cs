using Application.Abstractions.Messaging;

namespace Application.Product.Commands.AddComment
{
    public sealed record AddCommentCommand(Guid UserId,Guid? ParentId,Guid ProductId,string Content) : ICommand<Guid>;
}

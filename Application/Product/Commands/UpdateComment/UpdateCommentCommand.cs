using Application.Abstractions.Messaging;

namespace Application.Product.Commands.UpdateComment
{
    public sealed record UpdateCommentCommand(Guid UserId,Guid CommentId,string Content) : ICommand;
}


using Application.Abstractions.Messaging;

namespace Application.Product.Commands.DeleteComment
{
    public sealed record DeleteCommentCommand(Guid CommentId,Guid UserId) : ICommand;
}

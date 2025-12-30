using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Commands.UpdateComment
{
    public class UpdateCommentCommandHandler : ICommandHandler<UpdateCommentCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        public UpdateCommentCommandHandler(
            IProductRepository productRepository,
            IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _productRepository
                .GetComment()
                .FirstOrDefaultAsync(c => c.Id == request.CommentId, cancellationToken);
            if (comment == null)
                return Result.Failure(new Error("Comment.NotFound", "There is no comment with the id"));
            if (comment.UserId != request.UserId)
                return Result.Failure(new Error("Comment.Unauthorized", "You do not have permission to edit this comment"));
            comment.Content = request.Content;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

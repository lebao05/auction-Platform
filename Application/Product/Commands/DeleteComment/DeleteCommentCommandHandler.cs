using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Commands.DeleteComment
{
    public class DeleteCommentCommandHandler
        : ICommandHandler<DeleteCommentCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteCommentCommandHandler(
            IProductRepository productRepository,
            IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(
            DeleteCommentCommand request,
            CancellationToken cancellationToken)
        {
            var comment = await _productRepository
                .GetComment().FirstOrDefaultAsync(cancellationToken);

            if (comment is null)
            {
                return Result.Failure(
                    new Error("Comment.NotFound", "Comment not found"));
            }
            if (comment.UserId != request.UserId)
                return Result.Failure(new Error("Comment.Unathorized", "Not have permission to delete comment"));
            _productRepository.DeleteComment(comment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}

using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.AddComment
{
    public class AddCommentCommandHandler : ICommandHandler<AddCommentCommand,Guid>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        public AddCommentCommandHandler(
            IProductRepository productRepository,
            IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result<Guid>> Handle(AddCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = new Comment(request.Content, request.UserId, request.ProductId, request.ParentId);
            _productRepository.AddComment(comment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<Guid>.Success(comment.Id);
        }
    }
}

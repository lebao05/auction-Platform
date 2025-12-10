using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.DeleteFromBlackList
{
    public class DeleteFromBlackListCommandHandler : ICommandHandler<DeleteFromBlackListCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductRepository _productRepository;

        public DeleteFromBlackListCommandHandler(
            IUnitOfWork unitOfWork
            ,IProductRepository productRepository)
        {
            _unitOfWork = unitOfWork;
            _productRepository = productRepository;
        }

        public async Task<Result> Handle(DeleteFromBlackListCommand request, CancellationToken cancellationToken)
        {
            var bl = await _productRepository.GetBlackListById(request.Id,cancellationToken);
            if( bl == null )
            {
                return Result.Failure(new Error("BlackList.NotFound", "BlackList not exists"));
            }
            if (bl.SellerId != request.SellerId)
                return Result.Failure(new Error("Product.Seller", "Not have permission to delete blacklist"));
            _productRepository.DeleteBlackList(bl);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

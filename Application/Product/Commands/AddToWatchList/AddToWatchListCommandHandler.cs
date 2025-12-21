using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.AddToWatchList
{
    public class AddToWatchListCommandHandler : ICommandHandler<AddToWatchListCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        public AddToWatchListCommandHandler(
            IUnitOfWork unitOfWork,
            IProductRepository productRepository)
        {
            _unitOfWork = unitOfWork;
            _productRepository = productRepository;
        }
        public async Task<Result> Handle(AddToWatchListCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductAsyncById(request.productId,cancellationToken);
            if (product == null)
                return Result.Failure(new Error("Product.NotFound", "There is no product with this ID"));
            if (product.IsDeleted)
                return Result.Failure(new Error("Product.Deleted", "This product is already deleted"));
            var watchListExisting = await _productRepository.GetWatchList(request.userId,request.productId,cancellationToken);
            if (watchListExisting is not null)
                return Result.Failure(new Error("Watchlist.AlreadyExists", "You already add this product to watchlist"));
            var watchlist = Watchlist.CreateWatchList(request.userId, request.productId);
            _productRepository.AddWatchList(watchlist);
            await _unitOfWork.SaveChangesAsync();
            return Result.Success();
        }
    }
}

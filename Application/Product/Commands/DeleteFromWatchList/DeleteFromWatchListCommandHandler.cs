using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.DeleteFromWatchList
{
    public class DeleteFromWatchListCommandHandler : ICommandHandler<DeleteFromWatchListCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteFromWatchListCommandHandler(
            IProductRepository productRepository,
            IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result> Handle(DeleteFromWatchListCommand request, CancellationToken cancellationToken)
        {
            var watchlist = await _productRepository.GetWatchList(request.userId, request.productId, cancellationToken);
            if (watchlist == null)
                return Result.Failure(new Error("Watchlist.NotFound", "Watch list not exists"));
            
            _productRepository.DeleteWatchList(watchlist);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}



using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.CancelOrder
{
    public class CancelOrderCommandHandler : ICommandHandler<CancelOrderCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        public CancelOrderCommandHandler(
            IProductRepository productRepository
            ,IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository; 
            _unitOfWork = unitOfWork;
        }
        public async Task<Result> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductDetails(request.ProductId, cancellationToken);
            if (product == null)
                return Result.Failure(new Error("Product.NotFound", "There is no product with this Id"));
            if (product.SellerId != request.UserId)
                return Result.Failure(new Error("AppUser.Unauthorized", "You do not have permission to cancel order"));
            if (product.PaymentInvoiceUrl is null)
                return Result.Failure(new Error("AppUser.CancleOrder", "Order already has payment paid, you can't cancel it"));
            product.OrderStatus = Domain.Enums.OrderStatus.CancelledBySeller;
            await _unitOfWork.SaveChangesAsync();
            return Result.Success();
        }
        
    }
}

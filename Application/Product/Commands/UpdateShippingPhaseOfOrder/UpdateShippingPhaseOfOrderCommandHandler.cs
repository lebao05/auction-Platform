using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.UpdateShippingPhaseOfOrder
{
    public class UpdateShippingPhaseOfOrderCommandHandler : ICommandHandler<UpdateShippingPhaseOfOrderCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductRepository _productRepository;
        public UpdateShippingPhaseOfOrderCommandHandler(
            IProductRepository productRepository,
            IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _productRepository = productRepository;
        }
        public async Task<Result> Handle(UpdateShippingPhaseOfOrderCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductDetails(request.ProductId, cancellationToken);
            if (product is null)
            {
                return Result.Failure(new Error("Product.NotFound", "Product not found."));
            }
            if (product.SellerId != request.UserId)
            {
                return Result.Failure(new Error("Product.Unauthorized", "Only the seller can confirm the payment and change the status to Shipping"));
            }
            if( product.OrderStatus != Domain.Enums.OrderStatus.Shipping)
            {
                return Result.Failure(new Error("Product.InvalidStatus", "Product status must be 'Shipping' to update shipping information."));
            }
            product.ShippingInvoiceUrl = request.ShippingInvoiceUrl;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

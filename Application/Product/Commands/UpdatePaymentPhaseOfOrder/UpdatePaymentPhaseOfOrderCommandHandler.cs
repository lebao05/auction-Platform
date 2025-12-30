using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.UpdatePaymentPhaseOfOrder
{
    public class UpdatePaymentPhaseOfOrderCommandHandler : ICommandHandler<UpdatePaymentPhaseOfOrderCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        public UpdatePaymentPhaseOfOrderCommandHandler(
            IProductRepository productRepository,
            IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result> Handle(UpdatePaymentPhaseOfOrderCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductDetails(request.ProductId, cancellationToken);
            if (product is null)
            {
                return Result.Failure(new Error("Product.NotFound", "Product not found."));
            }
            var winner = product.BiddingHistories
                .OrderByDescending(b => b.BidAmount)
                .ThenBy(b => b.CreatedAt)
                .FirstOrDefault();
            if (winner is null)
            {
                return Result.Failure(new Error("BiddingHistory.NotFound", "No bidding history found for this product."));
            }
            if (winner.BidderId != request.UserId)
            {
                return Result.Failure(new Error("User.NotAuthorized", "User is not authorized to update payment phase for this order."));
            }
            if( product.OrderStatus != Domain.Enums.OrderStatus.WaitingForPayment)
            {
                return Result.Failure(new Error("Order.InvalidStatus", "Order is not in a valid status for payment phase update."));
            }
            product.PaymentInvoiceUrl = request.PaymentInvoiceUrl;
            product.ShippingAddress = request.ShippingAddress;
            product.ShippingPhone = request.ShippingPhone;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.ConfirmOrderStatus
{
    public class ConfirmOrderStatusCommandHandler : ICommandHandler<ConfirmOrderStatusCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        public ConfirmOrderStatusCommandHandler(
            IProductRepository productRepository
            , IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result> Handle(ConfirmOrderStatusCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductDetails(request.ProductId, cancellationToken);
            if (product == null)
            {
                return Result.Failure(new Error("Product.NotFound", "There is no product with this id"));
            }
            if (request.Status == Domain.Enums.OrderStatus.Shipping)
            {
                if (product.OrderStatus != Domain.Enums.OrderStatus.WaitingForPayment)
                {
                    return Result.Failure(new Error("Product.InvalidStatus", "The product is not in a valid status to change to Shipping"));
                }
                if (product.SellerId != request.UserId)
                {
                    return Result.Failure(new Error("Product.Unauthorized", "Only the seller can confirm the payment and change the status to Shipping"));
                }
                if (product.PaymentInvoiceUrl == null)
                {
                    return Result.Failure(new Error("Product.NoPaymentInvoice", "The product does not have a payment invoice to confirm payment"));
                }
                product.OrderStatus = Domain.Enums.OrderStatus.Shipping;
                await _unitOfWork.SaveChangesAsync();
                return Result.Success();
            }
            if (request.Status != Domain.Enums.OrderStatus.Completed)
            {
                return Result.Failure(new Error("Product.InvalidStatus", "The only valid status to confirm is Shipping or Completed"));
            }
            if (product.OrderStatus != Domain.Enums.OrderStatus.Shipping)
            {
                return Result.Failure(new Error("Product.InvalidStatus", "The product is not in a valid status to change to Completed"));
            }
            var winner = product.BiddingHistories
                .OrderByDescending(b => b.BidAmount)
                .ThenBy(b => b.CreatedAt)
                .FirstOrDefault();

            if (winner == null)
                return Result.Failure(new Error("Product.NotBidded", "This product didn't any winner"));
            if (winner!.BidderId != request.UserId)
            {
                return Result.Failure(new Error("Product.Unauthorized", "Only the buyer can confirm the delivery and change the status to Completed"));
            }
            if (product.ShippingInvoiceUrl is null)
                return Result.Failure(new Error("Product.NoShippingInvoice", "The product does not have a shipping invoice to confirm delivery"));
            product.OrderStatus = Domain.Enums.OrderStatus.Completed;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

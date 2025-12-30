using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetOrder
{
    public class GetOrderQueryHandler
        : IQueryHandler<GetOrderQuery, GetOrderResponse>
    {
        private readonly IProductRepository _productRepository;

        public GetOrderQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Result<GetOrderResponse>> Handle(
            GetOrderQuery request,
            CancellationToken cancellationToken)
        {
            var product = await _productRepository
                .GetProductDetails(request.ProductId, cancellationToken);

            if (product is null)
            {
                return Result.Failure<GetOrderResponse>(
                    new Error(
                        "Product.NotFound",
                        "There is no order with this id"
                    ));
            }

            // Buyer = highest bid (if exists)
            var winningBid = product.BiddingHistories
                .OrderByDescending(b => b.BidAmount)
                .ThenBy(b => b.CreatedAt)
                .FirstOrDefault();
            if (winningBid is null || (request.UserId != product.SellerId
                && request.UserId != winningBid.BidderId))
            {
                return Result.Failure<GetOrderResponse>(
                    new Error(
                        "Order.AccessDenied",
                        "You are not authorized to view this order"
                    ));
            }
            // Buyer → Seller rating
            var buyerRating = product.Ratings
                .FirstOrDefault(r =>
                    r.RaterId != product.SellerId);

            // Seller → Buyer rating
            var sellerRating = product.Ratings
                .FirstOrDefault(r =>
                    r.RaterId == product.SellerId);
            var response = new GetOrderResponse
            {
                // Order
                OrderStatus = product.OrderStatus,

                // Product
                ProductId = product.Id,
                ProductName = product.Name,
                FinalPrice = winningBid.BidAmount,
                // Images
                MainImageUrl = product.Images
                    .FirstOrDefault(i => i.IsMain)?.ImageUrl ?? string.Empty,

                ProductImageUrl = product.Images
                    .Where(i => !string.IsNullOrEmpty(i.ImageUrl))
                    .Select(i => i.ImageUrl!)
                    .FirstOrDefault()!,

                // Buyer (nullable)
                BuyerId = winningBid?.Id ?? Guid.Empty,
                BuyerName = winningBid?.Bidder?.FullName ?? string.Empty,
                BuyerAvatarUrl = winningBid?.Bidder?.AvatarUrl ?? string.Empty,

                // Seller
                SellerId = product.SellerId,
                SellerName = product.Seller.FullName,
                SellerAvatarUrl = product.Seller.AvatarUrl,

                // Shipping (buyer side)
                ShippingAddress = product.ShippingAddress,
                ShippingPhone = product.ShippingPhone,

                // Payment
                PaymentInvoiceUrl = product.PaymentInvoiceUrl,

                // Shipping (seller side)
                ShippingInvoiceUrl = product.ShippingInvoiceUrl,

                BuyerRating = buyerRating == null
                    ? null
                    : new RatingDto
                    {
                        Id = buyerRating.Id,
                        RatingType = buyerRating.RatingType,
                        Comment = buyerRating.Comment,

                        RaterId = buyerRating.RaterId,
                        RaterName = buyerRating.Rater.FullName,
                        RaterAvatarUrl = buyerRating.Rater.AvatarUrl,

                        RatedUserId = buyerRating.RatedUserId,
                        RatedUserName = buyerRating.RatedUser.FullName,
                        RatedUserAvatarUrl = buyerRating.RatedUser.AvatarUrl
                    },
                SellerRating = sellerRating == null
                    ? null
                    : new RatingDto
                    {
                        Id = sellerRating.Id,
                        RatingType = sellerRating.RatingType,
                        Comment = sellerRating.Comment,

                        RaterId = sellerRating.RaterId,
                        RaterName = sellerRating.Rater.FullName,
                        RaterAvatarUrl = sellerRating.Rater.AvatarUrl,

                        RatedUserId = sellerRating.RatedUserId,
                        RatedUserName = sellerRating.RatedUser.FullName,
                        RatedUserAvatarUrl = sellerRating.RatedUser.AvatarUrl
                    }
            };

            return Result.Success(response);
        }
    }
}

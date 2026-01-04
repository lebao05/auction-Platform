using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetProductsOfAUser
{
    public class GetProductOfAUserQueryHandler : IQueryHandler<GetProductOfAUserQuery, GetProductOfAUserResponse>
    {
        private readonly IProductRepository _productRepository;
        public GetProductOfAUserQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }
        public async Task<Result<GetProductOfAUserResponse>> Handle(GetProductOfAUserQuery request, CancellationToken cancellationToken)
        {
            var userId = request.UserId;
            var now = DateTime.UtcNow;

            // =======================
            // 1. Load products (NO masking here)
            // =======================
            var products = await _productRepository.GetProducts()
                .Where(p =>
                    p.SellerId == userId ||
                    p.Winnerid == userId ||
                    p.BiddingHistories.Any(b => b.BidderId == userId))
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,

                    StartPrice = p.StartPrice,
                    StepPrice = p.StepPrice,
                    BuyNowPrice = p.BuyNowPrice,

                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    OrderStatus = p.OrderStatus,

                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,

                    SellerId = p.SellerId,
                    SellerName = p.Seller.FullName,

                    WinnerId = p.Winnerid,
                    WinnerName = p.Winner != null ? p.Winner.FullName : null,

                    BiddingCount = p.BiddingHistories.Count,

                    HighestBid = p.BiddingHistories
                        .OrderByDescending(b => b.BidAmount)
                        .ThenBy(b => b.CreatedAt)
                        .Select(b => b.BidAmount)
                        .FirstOrDefault(),

                    YourBidding = p.BiddingHistories
                        .Where(b => b.BidderId == userId)
                        .OrderByDescending(b => b.BidAmount)
                        .ThenBy(b => b.CreatedAt)
                        .Select(b => b.BidAmount)
                        .FirstOrDefault(),

                    MainImageUrl = p.Images
                        .Where(i => i.IsMain)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault(),

                    IsSelling = p.SellerId == userId && p.EndDate > now,
                    IsSellEnded = p.SellerId == userId && p.EndDate <= now,
                    IsWon = p.Winnerid == userId && p.EndDate <now,
                    IsBidding = p.BiddingHistories.Any(b => b.BidderId == userId) && p.EndDate > now,
                })
                .ToListAsync(cancellationToken);

            // =======================
            // 2. Apply masking rules (IN MEMORY)
            // =======================
            foreach (var p in products)
            {
                // Case 1: User is bidding but NOT highest bidder
                if (p.IsBidding && userId != p.WinnerId )
                {
                    p.WinnerId = null;
                    p.WinnerName = NameMaskingUtil.MaskKeepLength(p.WinnerName);
                }

                // Case 2: User is selling & auction NOT ended
                if (p.IsSelling)
                {
                    p.WinnerId = null;
                    p.WinnerName = NameMaskingUtil.MaskKeepLength(p.WinnerName);
                }
            }

            // =======================
            // 3. Group response
            // =======================
            var response = new GetProductOfAUserResponse
            {
                ProductsSelling = products.Where(p => p.IsSelling).ToList(),
                ProductsSold = products.Where(p => p.IsSellEnded).ToList(),
                ProductsWon = products.Where(p => p.IsWon).ToList(),
                ProductsBidding = request.ViewerId.HasValue && request.ViewerId.Value == request.UserId ?products
                    .Where(p => p.IsBidding && !p.IsSelling && !p.IsWon)
                    .ToList() : null,
            };

            return Result.Success(response);
        }
    }
}

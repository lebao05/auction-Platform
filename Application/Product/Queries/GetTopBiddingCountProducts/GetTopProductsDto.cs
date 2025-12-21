using Domain.Common;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Application.Product.Queries.GetTopBiddingCountProducts
{
    public sealed class GetTopProductsDto
    {
        public Guid Id { get; init; }
        public bool IsNew { get; init; }
        public string Name { get; init; } = string.Empty;

        // Price
        public long StartPrice { get; init; }
        public long StepPrice { get; init; }
        public long? BuyNowPrice { get; init; }

        // Auction
        public int BiddingCount { get; init; }
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }

        // Seller
        public Guid SellerId { get; init; }
        public string SellerName { get; init; } = string.Empty;
        public string? SellerAvatarUrl { get; init; }

        // Category
        public Guid? CategoryId { get; init; }
        public string CategoryName { get; init; } = string.Empty;

        // Media
        public string MainImageUrl { get; init; } = string.Empty;

        // Top Bidder
        public long? TopBidding { get; init; }
        public Guid? TopBidderId { get; init; }
        public string? TopBidderName { get; init; }
        public string? TopBidderAvatarUrl { get; init; }

        // -----------------------------
        // EF Core Projection with IsNew threshold
        // -----------------------------
        public static Expression<Func<Domain.Entities.Product, GetTopProductsDto>> Projection(DateTime newThreshold)
        {
            return p => new GetTopProductsDto
            {
                Id = p.Id,
                Name = p.Name,
                IsNew = p.StartDate >= newThreshold, // EF Core có thể translate sang SQL

                StartPrice = p.StartPrice,
                StepPrice = p.StepPrice,
                BuyNowPrice = p.BuyNowPrice,

                TopBidding = p.BiddingHistories
                    .OrderByDescending(b => b.BidAmount)
                    .ThenBy(b => b.CreatedAt)
                    .Select(b => (long?)b.BidAmount)
                    .FirstOrDefault(),

                BiddingCount = p.BiddingCount,
                StartDate = p.StartDate,
                EndDate = p.EndDate,

                SellerId = p.SellerId,
                SellerName = p.Seller.FullName,
                SellerAvatarUrl = p.Seller.AvatarUrl,

                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : "",

                MainImageUrl = p.Images
                    .Where(i => i.IsMain)
                    .Select(i => i.ImageUrl)
                    .FirstOrDefault() ?? "",

                TopBidderId = p.BiddingHistories
                    .OrderByDescending(b => b.BidAmount)
                    .ThenBy(b => b.CreatedAt)
                    .Select(b => (Guid?)b.BidderId)
                    .FirstOrDefault(),

                TopBidderName = p.BiddingHistories
                    .OrderByDescending(b => b.BidAmount)
                    .ThenBy(b => b.CreatedAt)
                    .Select(b => NameMaskingUtil.MaskKeepLength(b.Bidder.FullName))
                    .FirstOrDefault(),

                TopBidderAvatarUrl = p.BiddingHistories
                    .OrderByDescending(b => b.BidAmount)
                    .ThenBy(b => b.CreatedAt)
                    .Select(b => b.Bidder.AvatarUrl)
                    .FirstOrDefault()
            };
        }

    }
}

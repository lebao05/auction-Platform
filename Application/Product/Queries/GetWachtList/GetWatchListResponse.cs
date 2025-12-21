using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Product.Queries.GetWachtList
{
    public sealed class GetWatchListResponse
    {
        public Guid Id { get; init; }

        public Guid ProductId { get; init; }
        public string ProductName { get; init; } = string.Empty;
        public long StartPrice { get; init; }
        public long BidCount { get; init; }
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }

        public string MainImageUrl { get; init; } = null!;

        public Guid SellerId { get; init; }
        public string SellerName { get; init; } = string.Empty;
        public string? SellerAvatar { get; init; }

        // Top bidding
        public long? HighestBid { get; init; }
        public Guid? HighestBidderId { get; init; }
        public string? HighestBidderName { get; init; }
    }
}

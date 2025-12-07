namespace Application.Product.Queries.GetProductsForSeller
{
    public sealed class GetProductsForSellerResponse
    {
        public Guid Id { get; init; }

        public string Name { get; init; } = string.Empty;
        public long? BuyNowPrice { get; init; }
        public long StartPrice { get; init; }
        public long StepPrice { get; init; }
        public int BiddingCount { get; init; }
        public long CurrentMaxBidAmount { get; init; }
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }
        public Guid SellerId { get; init; }
        public string CategoryName { get; init; } = string.Empty;
        public string MainImageUrl { get; init; } = null!;
    }
}

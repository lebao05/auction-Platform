using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Queries.GetWachtList
{
    public class GetWachtListQueryHandler : IQueryHandler<GetWatchListQuery, List<GetWatchListResponse>>
    {
        private readonly IProductRepository _productRepository;
        public GetWachtListQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }
        public async Task<Result<List<GetWatchListResponse>>> Handle(GetWatchListQuery request, CancellationToken cancellationToken)
        {
            var watchList = await _productRepository.GetLikedProducts(request.userId,cancellationToken);
            var dto = watchList.Select(w =>
            {
                var highestBid = w.Product.BiddingHistories
                    .OrderByDescending(b => b.BidAmount)
                    .FirstOrDefault();

                return new GetWatchListResponse
                {
                    Id = w.Id,

                    ProductId = w.Product.Id,
                    ProductName = w.Product.Name,
                    StartPrice = w.Product.StartPrice,
                    BidCount = w.Product.BiddingCount,
                    StartDate = w.Product.StartDate,
                    EndDate = w.Product.EndDate,

                    MainImageUrl = w.Product.Images
                        .FirstOrDefault(i => i.IsMain)!.ImageUrl!,

                    SellerId = w.Product.Seller.Id,
                    SellerName = w.Product.Seller.FullName,
                    SellerAvatar = w.Product.Seller.AvatarUrl,

                    HighestBid = highestBid?.BidAmount,
                    HighestBidderId = highestBid?.BidderId,
                    HighestBidderName = highestBid?.Bidder.FullName
                };
            }).ToList();

            return Result.Success<List<GetWatchListResponse>>(dto);
        }
    }
}

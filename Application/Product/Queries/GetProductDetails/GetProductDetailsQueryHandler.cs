using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Product.Queries.GetProductDetails
{
    public class GetProductDetailsQueryHandler
        : IQueryHandler<GetProductDetailsQuery, GetProductDetailsResponse>
    {
        private readonly IProductRepository _productRepository;

        public GetProductDetailsQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Result<GetProductDetailsResponse>> Handle(GetProductDetailsQuery request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductDetails(request.productId, cancellationToken);
            if (product is null)
                return Result.Failure<GetProductDetailsResponse>(new Error("Product.NotFound", "There is no product with this Id"));
            var topBidding = product
                .BiddingHistories
                .OrderByDescending(b => b.BidAmount)
                .ThenBy(b => b.CreatedAt)
                .Select(b => new TopBidding
                {
                    UserId = b.BidderId,
                    BidAmount = b.BidAmount,
                    FullName = request.userId.HasValue && b.BidderId == request.userId.Value ? b.Bidder.FullName : MaskName(b.Bidder.FullName),
                })
                .FirstOrDefault();
            var response = new GetProductDetailsResponse
            {
                Id = product.Id,
                Name = product.Name,
                BuyNowPrice = product.BuyNowPrice,
                StartPrice = product.StartPrice,
                StepPrice = product.StepPrice,
                AllowAll = product.AllowAll,
                BiddingCount = product.BiddingCount,
                TopBidding = topBidding,
                IsAutoRenewal = product.IsAutoRenewal,
                StartDate = product.StartDate,
                EndDate = product.EndDate,
                Description = product.Description,

                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name,

                SellerId = product.SellerId,
                SellerFullName = product.Seller.FullName,

                Images = product.Images.Select(img => new ProductImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl!,
                    IsMain = img.IsMain
                }).ToList(),

                BiddingHistories = product.BiddingHistories
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BiddingHistoryDto
            {
                Id = b.Id,
                UserId = b.BidderId,
                UserName = request.userId.HasValue && b.BidderId == request.userId.Value
                        ? b.Bidder.FullName
                        : MaskName(b.Bidder.FullName),
                BidAmount = b.BidAmount,
                CreatedAt = b.CreatedAt
            }).ToList(),

                Comments = product.Comments
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    FullName = c.User.FullName,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt
                }).ToList()
            };

            return response;
        }
        private static string MaskName(string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName) || fullName.Length <= 3)
                return "***";

            int prefix = 2;
            int suffix = 3;

            string start = fullName.Substring(0, prefix);
            string end = fullName.Substring(fullName.Length - suffix);

            return $"{start}***{end}";
        }

    }
}

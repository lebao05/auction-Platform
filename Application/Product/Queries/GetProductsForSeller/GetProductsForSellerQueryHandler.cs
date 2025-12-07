using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Queries.GetProductsForSeller
{
    public class GetProductsForSellerQueryHandler : IQueryHandler<GetProductsForSellerQuery, List<GetProductsForSellerResponse>>
    {
        private readonly IProductRepository _productRepository;
        public GetProductsForSellerQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }
        public async Task<Result<List<GetProductsForSellerResponse>>> Handle(GetProductsForSellerQuery request, CancellationToken cancellationToken)
        {
            var list = await _productRepository.GetProductsForSeller(request.sellerId,cancellationToken);
            var dto = list.Select(p => new GetProductsForSellerResponse
            {
                Id = p.Id,
                Name = p.Name,
                BuyNowPrice = p.BuyNowPrice,
                StartPrice = p.StartPrice,
                StepPrice = p.StepPrice,
                BiddingCount = p.BiddingCount,
                CurrentMaxBidAmount = p.CurrentMaxBidAmount,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                SellerId = p.SellerId,
                CategoryName = p.Category?.Name ?? string.Empty,

                // Filter image here
                MainImageUrl = p.Images
                           .Where(i => i.IsMain)
                           .Select(i => i.ImageUrl)
                           .FirstOrDefault() ?? string.Empty
            })
                   .ToList();

            return dto;
        }
    }
}

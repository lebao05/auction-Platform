using Application.Abstractions.Messaging;
using Application.Product.Queries.GetTopBiddingCountProducts;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetTopValueProducts
{
    public sealed class GetTopValueProductsQueryHandler : IQueryHandler<GetTopValueProductsQuery, List<GetTopProductsDto>>
    {
        private readonly IProductRepository _productRepository;
        private readonly ISystemSettingRepository _systemSettingRepository;
        public GetTopValueProductsQueryHandler(IProductRepository productRepository
            ,ISystemSettingRepository systemSettingRepository)
        {
            _systemSettingRepository = systemSettingRepository;
            _productRepository = productRepository;
        }
        public async Task<Result<List<GetTopProductsDto>>> Handle(
            GetTopValueProductsQuery request,
            CancellationToken cancellationToken)
        {
            // Get base query from repository
            var query = _productRepository.GetTopProducts()
                .Where(p => p.EndDate > DateTime.UtcNow)
                // Order by highest bid in BiddingHistories
                .OrderByDescending(p => p.BiddingHistories
                    .OrderByDescending(b => b.BidAmount)
                    .ThenBy(b => b.CreatedAt)
                    .Select(b => (long?)b.BidAmount)
                    .FirstOrDefault()
                );

            var pageIndex = request.PageIndex < 1 ? 1 : request.PageIndex;
            var pageSize = request.PageSize < 1 ? 8 : request.PageSize;
            var skip = (pageIndex - 1) * pageSize;
            var newThreshold = DateTime.UtcNow.AddMinutes(-5); // sản phẩm mới trong 5 phút

            var items = await query
                .Skip(skip)
                .Take(pageSize)
                .Select(GetTopProductsDto.Projection(newThreshold))
                .ToListAsync(cancellationToken);

            return Result<List<GetTopProductsDto>>.Success(items);
        }
    }
}

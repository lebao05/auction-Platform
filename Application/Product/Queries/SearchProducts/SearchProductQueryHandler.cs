using Application.Abstractions.Messaging;
using Application.Product.Queries.GetTopBiddingCountProducts;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.SearchProducts
{
    public sealed class SearchProductQueryHandler : IQueryHandler<SearchProductsQuery, List<GetTopProductsDto>>
    {
        private readonly IProductRepository _productRepository;
        private readonly ISystemSettingRepository _systemSettingRepository;

        public SearchProductQueryHandler(IProductRepository productRepository
            , ISystemSettingRepository systemSettingRepository)
        {
            _productRepository = productRepository;
            _systemSettingRepository = systemSettingRepository;
        }

        public async Task<Result<List<GetTopProductsDto>>> Handle(
            SearchProductsQuery request,
            CancellationToken cancellationToken)
        {
            var query = _productRepository.GetTopProducts();

            // 2️⃣ Full-Text Search nếu có SearchTerm
            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                query = _productRepository.SearchProducts(request.SearchTerm);
            }
            // 3️⃣ Filter theo Category
            if (request.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == request.CategoryId.Value || p.Category.ParentId == request.CategoryId.Value);
            }

            // 4️⃣ Sắp xếp theo yêu cầu người dùng
            IOrderedQueryable<Domain.Entities.Product> orderedQuery =
                query.OrderByDescending(p => p.EndDate >= DateTime.UtcNow); 
            query = request.SortBy?.ToLower() switch
            {
                "pricedecsending" => orderedQuery.ThenByDescending(p =>
                            p.BiddingHistories.Any()
                                ? p.BiddingHistories.Max(b => b.BidAmount)
                                : 0
                        ),
                "priceascsending" => orderedQuery.ThenBy(p =>
                            p.BiddingHistories.Any()
                                ? p.BiddingHistories.Max(b => b.BidAmount)
                                : 0
                        ),
                "endingsoon" => orderedQuery.ThenBy(p => p.EndDate),
                "newest" => orderedQuery.ThenByDescending(p => p.CreatedAt),
                _ => query // default: do nothing, leave ordering as-is
            };
            query = query
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize);
            var timeForNew = await _systemSettingRepository.GetSystemSettingByKey(SystemSettingKey.NewProductTime, cancellationToken);
            var newThreshold = DateTime.UtcNow.AddMinutes(timeForNew!.SystemValue);
            var productsDto = await query
                .Select(GetTopProductsDto.Projection(newThreshold))
                .ToListAsync(cancellationToken);

            return Result.Success(productsDto);
        }
    }
}

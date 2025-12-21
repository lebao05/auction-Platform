using Application.Abstractions.Messaging;
using Application.Product.Queries.GetTopBiddingCountProducts;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.SearchProducts
{
    public sealed class SearchProductQueryHandler : IQueryHandler<SearchProductsQuery, List<GetTopProductsDto>>
    {
        private readonly IProductRepository _productRepository;

        public SearchProductQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
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
                query = query.Where(p => p.CategoryId == request.CategoryId.Value);
            }

            // 4️⃣ Sắp xếp theo yêu cầu người dùng
            query = request.SortBy?.ToLower() switch
            {
                "price" => request.SortDescending
                    ? query.OrderByDescending(p => p.BiddingHistories.Select(b=>b.BidAmount).FirstOrDefault() | 0)
                    : query.OrderBy(p => p.BiddingHistories.Select(b => b.BidAmount).FirstOrDefault() | 0),

                "enddate" => request.SortDescending
                    ? query.OrderByDescending(p => p.EndDate)
                    : query.OrderBy(p => p.EndDate),

                "newest" => request.SortDescending
                    ? query.OrderByDescending(p => p.CreatedAt)
                    : query.OrderBy(p => p.CreatedAt),
                   _ => query // default: do nothing, leave ordering as-is
            };

            query = query
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize);
            var newThreshold = DateTime.UtcNow.AddMinutes(-5); 

            var productsDto = await query
                .Select(GetTopProductsDto.Projection(newThreshold))
                .ToListAsync(cancellationToken);

            return Result.Success(productsDto);
        }
    }
}

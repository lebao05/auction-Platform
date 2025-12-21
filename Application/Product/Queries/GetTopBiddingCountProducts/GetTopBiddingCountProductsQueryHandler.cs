using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetTopBiddingCountProducts
{
    public sealed class GetTopBiddingCountProductsHandler
        : IQueryHandler<GetTopBiddingCountProductsQuery, List<GetTopProductsDto>>
    {
        private readonly IProductRepository _productRepository;

        public GetTopBiddingCountProductsHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Result<List<GetTopProductsDto>>> Handle(
            GetTopBiddingCountProductsQuery request,
            CancellationToken cancellationToken)
        {
            var query = _productRepository.GetTopProducts()
                .Where(p => p.EndDate > DateTime.UtcNow)
                .OrderByDescending(p => p.BiddingCount);

            var pageIndex = request.PageIndex < 1 ? 1 : request.PageIndex;
            var pageSize = request.PageSize < 1 ? 10 : request.PageSize;
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

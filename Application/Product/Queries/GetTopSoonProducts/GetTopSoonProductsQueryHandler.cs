using Application.Abstractions.Messaging;
using Application.Product.Queries.GetTopBiddingCountProducts;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetTopSoonProducts
{
    public sealed class GetTopSoonProductsHandler
        : IQueryHandler<GetTopSoonProductsQuery, List<GetTopProductsDto>>
    {
        private readonly IProductRepository _productRepository;

        public GetTopSoonProductsHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Result<List<GetTopProductsDto>>> Handle(
            GetTopSoonProductsQuery request,
            CancellationToken cancellationToken)
        {
            var pageIndex = request.PageIndex < 1 ? 1 : request.PageIndex;
            var pageSize = request.PageSize < 1 ? 8 : request.PageSize;
            var skip = (pageIndex - 1) * pageSize;

            var query = _productRepository.GetTopProducts()
                .Where(p => p.EndDate > DateTime.UtcNow)
                .OrderBy(p => p.EndDate);
            var newThreshold = DateTime.UtcNow.AddMinutes(-5); // sản phẩm mới trong 5 phút


            var items = await query
                .Skip(skip)
                .Take(pageSize)
                .Select(GetTopProductsDto.Projection(newThreshold))
                .ToListAsync(cancellationToken);

            return items;
        }
    }
}

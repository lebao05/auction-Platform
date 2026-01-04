using Application.Abstractions.Messaging;
using Application.Product.Queries.GetTopBiddingCountProducts;
using Domain.Common;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetTopSoonProducts
{
    public sealed class GetTopSoonProductsHandler
        : IQueryHandler<GetTopSoonProductsQuery, List<GetTopProductsDto>>
    {
        private readonly IProductRepository _productRepository;
        private readonly ISystemSettingRepository _systemSettingRepository;

        public GetTopSoonProductsHandler(IProductRepository productRepository
            , ISystemSettingRepository systemSettingRepository)
        {
            _productRepository = productRepository;
            _systemSettingRepository = systemSettingRepository;
        }

        public async Task<Result<List<GetTopProductsDto>>> Handle(
            GetTopSoonProductsQuery request,
            CancellationToken cancellationToken)
        {
            var pageIndex = request.PageIndex < 1 ? 1 : request.PageIndex;
            var pageSize = request.PageSize < 1 ? 8 : request.PageSize;
            var skip = (pageIndex - 1) * pageSize;

            var query = _productRepository.GetTopProducts()
                .OrderByDescending(p => p.EndDate >= DateTime.UtcNow);
            query = query.ThenBy(p => p.EndDate );

            var timeForNew = await _systemSettingRepository.GetSystemSettingByKey(SystemSettingKey.NewProductTime, cancellationToken);
            var newThreshold = DateTime.UtcNow.AddMinutes(timeForNew!.SystemValue);
            var items = await query
                .Skip(skip)
                .Take(pageSize)
                .Select(GetTopProductsDto.Projection(newThreshold))
                .ToListAsync(cancellationToken);

            return items;
        }
    }
}

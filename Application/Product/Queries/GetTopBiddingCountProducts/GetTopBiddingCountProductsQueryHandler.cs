using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Repositories;
using Domain.Shared;using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetTopBiddingCountProducts
{
    public sealed class GetTopBiddingCountProductsHandler
        : IQueryHandler<GetTopBiddingCountProductsQuery, List<GetTopProductsDto>>
    {
        private readonly IProductRepository _productRepository;
        private readonly ISystemSettingRepository _systemSettingRepository;

        public GetTopBiddingCountProductsHandler(IProductRepository productRepository, ISystemSettingRepository systemSettingRepository)
        {
            _productRepository = productRepository;
            _systemSettingRepository = systemSettingRepository;
        }

        public async Task<Result<List<GetTopProductsDto>>> Handle(
            GetTopBiddingCountProductsQuery request,
            CancellationToken cancellationToken)
        {
            var query = _productRepository.GetTopProducts()
                .OrderByDescending(p => p.EndDate >= DateTime.UtcNow);
            query = query.ThenByDescending(p=>p.BiddingCount);
            var pageIndex = request.PageIndex < 1 ? 1 : request.PageIndex;
            var pageSize = request.PageSize < 1 ? 10 : request.PageSize;
            var skip = (pageIndex - 1) * pageSize;
            var timeForNew = await _systemSettingRepository.GetSystemSettingByKey(SystemSettingKey.NewProductTime, cancellationToken);
            var newThreshold = DateTime.UtcNow.AddMinutes(timeForNew!.SystemValue);
            var items = await query
                .Skip(skip)
                .Take(pageSize)
                .Select(GetTopProductsDto.Projection(newThreshold))
                .ToListAsync(cancellationToken);

            return Result<List<GetTopProductsDto>>.Success(items);
        }
    }
}

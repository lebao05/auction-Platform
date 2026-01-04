using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetRatings
{
    public class GetRatingsQueryHandler : IQueryHandler<GetRatingsQuery,List<GetRatingResponse>>
    {
        private readonly IProductRepository _productRepository;
        public GetRatingsQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Result<List<GetRatingResponse>>> Handle(GetRatingsQuery request, CancellationToken cancellationToken)
        {
            IQueryable<Rating> query = _productRepository.GetRatings()
                .Include(r => r.Rater)
                .Include(r => r.RatedUser);
            query = request.ViewerId.HasValue && request.ViewerId.Value == request.UserID
                ? query.Where(r => r.RatedUserId == request.UserID || r.RaterId == request.UserID)
                : query.Where(r => r.RatedUserId == request.UserID);
            return await query
                .Select(r => new GetRatingResponse
                {
                    Id = r.Id,
                    RatingType = r.RatingType,
                    Comment = r.Comment,
                    ProductId = r.ProductId,
                    RaterId = r.RaterId,
                    RaterName = r.Rater.FullName,
                    RaterAvatarUrl = r.Rater.AvatarUrl,
                    RatedUserId = r.RatedUserId,
                    RatedUserName = r.RatedUser.FullName,
                    RatedUserAvatarUrl = r.RatedUser.AvatarUrl,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync(cancellationToken);
        }
    }
}

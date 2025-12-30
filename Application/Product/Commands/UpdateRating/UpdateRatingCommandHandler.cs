using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.UpdateRating
{
    public class UpdateRatingCommandHandler : ICommandHandler<UpdateRatingCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        public UpdateRatingCommandHandler(
            IProductRepository productRepository,
            IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _productRepository = productRepository;
        }
        public async Task<Result> Handle(UpdateRatingCommand request, CancellationToken cancellationToken)
        {
            var rating = await _productRepository.GetRatingById(request.RatingId, cancellationToken);
            if( rating is null)
            {
                return Result.Failure(new Error("Rating.NotFound", "Rating not found."));
            }
            if( rating.RaterId != request.UserId)
            {
                return Result.Failure(new Error("Rating.Unauthorized", "You are not authorized to update this rating."));
            }
            rating.UpdateRating(request.RatingType, request.Comment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

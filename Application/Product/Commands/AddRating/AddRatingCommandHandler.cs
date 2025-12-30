using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using Domain.Shared;
using System.Numerics;

namespace Application.Product.Commands.AddRating
{
    public class AddRatingCommandHandler : ICommandHandler<AddRatingCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductRepository _productRepository;
        public AddRatingCommandHandler(
            IUnitOfWork unitOfWork,
            IProductRepository productRepository) {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result> Handle(AddRatingCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductDetails(request.ProductId, cancellationToken);
            if( product is null)
            {
                return Result.Failure(new Error("AddRatingCommandHandler.Handle", $"Cannot find product with id {request.ProductId}"));
            }
            if (product.OrderStatus != OrderStatus.Completed)
            {
                return Result.Failure(
                    new Error(
                        "Rating.NotAllowed",
                        "You can only rate after the order is completed"
                    ));
            }
            var winner = product.BiddingHistories.OrderByDescending(b => b.BidAmount)
                .ThenBy(b=>b.CreatedAt)
                .FirstOrDefault();
           
           if(winner is null )
                return Result.Failure(new Error("AddRatingCommandHandler.Handle", $"No bids found for product with id {request.ProductId}"));
           if(  winner.BidderId != request.Userid && product.SellerId != request.Userid)
                return Result.Failure(new Error("AddRatingCommandHandler.Handle", $"Only winner or seller can add rating for product with id {request.ProductId}"));
            var ratedUserId = product.SellerId == request.Userid ? winner.BidderId : product.SellerId;  
            bool isAdded = await _productRepository.IsRatingExisting(request.Userid, ratedUserId, request.ProductId, cancellationToken);
            if( isAdded )
                {
                return Result.Failure(new Error("AddRatingCommandHandler.Handle", $"Rating already exists for product with id {request.ProductId} from user {request.Userid} to user {ratedUserId}"));
            }
           
            // ✅ CREATE RATING
            var rating = new Rating(
                request.RatingType,
                request.Comment,
                request.ProductId,
                request.Userid,
                ratedUserId);

            // ✅ ATTACH TO AGGREGATE
            _productRepository.AddRating(rating);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.PlaceBid
{
    public class PlaceBidCommandHandler : ICommandHandler<PlaceBidCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductRepository _productRepository;

        public PlaceBidCommandHandler(IUnitOfWork unitOfWork, IProductRepository productRepository)
        {
            _unitOfWork = unitOfWork;
            _productRepository = productRepository;
        }

        public async Task<Result> Handle(PlaceBidCommand request, CancellationToken cancellationToken)
        {
            // Load product + highest bid + auto-bids
            var maxBixAmount = request.maxBidAmount;
            var productId = request.productId;
            var userId = request.userId;
            var product = await _productRepository.GetProductForPlaceBid(
                request.productId,
                cancellationToken
            );

            if (product is null)
                return Result.Failure(new Error("Product.NotFound", "Product does not exist."));

            if (product.IsDeleted)
                return Result.Failure(new Error("Product.Deleted", "This product has been deleted."));

            if (product.SellerId == userId)
                return Result.Failure(new Error("Product.SelfBidNotAllowed", "You cannot bid on your own product."));

            if (product.EndDate <= DateTime.UtcNow)
                return Result.Failure(new Error("Product.Ended", "This auction has ended."));
            if (product.StartPrice >= maxBixAmount)
                return Result.Failure(new Error("Product.InValidPrice", "Your bidding must greater than or equal to startprice"));

            if( (maxBixAmount - product.StartPrice) % product.StepPrice != 0)
                return Result.Failure(new Error(
                    "Product.InvalidPrice",
                    $"Your bidding must follow the step price of {product.StepPrice}"
                ));            // Check blacklist
            var blacklist = await _productRepository.GetBlackListAsync(
                request.userId,
                request.productId,
                cancellationToken
            );

            if (blacklist is not null)
                return Result.Failure(new Error("Bidding.Blacklisted", "You have been blocked from bidding."));

            // Load existing auto bid of this user
            var myAutoBid = await _productRepository.GetAutoBidding(
                request.userId,
                request.productId,
                cancellationToken
            );

            var newMaxAutoBid = request.maxBidAmount;

            // Validate auto bid
            if (myAutoBid != null && newMaxAutoBid <= myAutoBid.MaxBidAmount)
            {
                return Result.Failure(
                    new Error(
                        "Bid.Invalid",
                        "Your max auto-bid must be higher than your previous max auto-bid."
                    )
                );
            }
            var maxAuto = product.AutomatedBiddings.FirstOrDefault();
            var maxBidding = product.BiddingHistories.FirstOrDefault();
            long increment = product.StepPrice;

            long startPrice = product.StartPrice;
            long? buyNowPrice = product.BuyNowPrice;

            //A
            if ( maxAuto == null )
            {
                var auto = new AutomatedBidding(maxBixAmount,productId,userId,Guid.NewGuid());
                long bidAmount = startPrice;
                if( buyNowPrice.HasValue )
                    bidAmount = Math.Min(maxBixAmount, buyNowPrice.Value);
                var bidding = new BiddingHistory(bidAmount, productId, userId);
                if( buyNowPrice.HasValue && bidAmount == buyNowPrice ) 
                    product.EndDate = DateTime.Now;
                product.BiddingCount++;
                _productRepository.AddAutoBidding(auto);
                _productRepository.AddBiddingHistory(bidding);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success();
            }
            //B
            if( myAutoBid is null )
            {
                var auto = new AutomatedBidding(maxBixAmount, productId, userId, Guid.NewGuid());
                _productRepository.AddAutoBidding(auto);
                //case1
                if( maxBidding!.BidAmount >= maxBixAmount )
                {
                    var bidding = new BiddingHistory(maxBixAmount, productId, userId);
                    _productRepository.AddBiddingHistory(bidding);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    return Result.Success();
                }
                //case2
                if(maxBixAmount <= maxAuto.MaxBidAmount)
                {
                    if(maxBidding.BidAmount != maxBixAmount)
                    {
                        var topBidding = new BiddingHistory(maxBixAmount, productId, maxAuto.BidderId);
                        _productRepository.AddBiddingHistory(topBidding);
                    }
                    var bidding = new BiddingHistory(maxBixAmount, productId, userId);
                    _productRepository.AddBiddingHistory(bidding);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    return Result.Success();
                }
                //case3
                if (maxBixAmount > maxAuto.MaxBidAmount)
                {
                    if( maxBidding.BidAmount != maxAuto.MaxBidAmount )
                    {
                        var other = new BiddingHistory(maxAuto.MaxBidAmount, productId, maxAuto.BidderId);
                        _productRepository.AddBiddingHistory(other);
                    }
                    long bidAmount = maxAuto.MaxBidAmount + product.StepPrice;
                    if( buyNowPrice.HasValue ) bidAmount = Math.Min(maxBixAmount, buyNowPrice.Value);
                    if( buyNowPrice.HasValue && buyNowPrice.Value == bidAmount)
                        product.EndDate = DateTime.UtcNow;
                    var bidding = new BiddingHistory(bidAmount, productId, userId);
                    _productRepository.AddBiddingHistory(bidding);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    return Result.Success();
                }


            }
            //C

            //case1 me on top
            if( maxAuto.BidderId == userId )
            {
                maxAuto.MaxBidAmount = maxBixAmount;
                if( buyNowPrice.HasValue && buyNowPrice.Value <= maxAuto.MaxBidAmount )
                {
                    var bidding = new BiddingHistory(buyNowPrice.Value, productId, userId);
                    product.EndDate = DateTime.UtcNow;
                    _productRepository.AddBiddingHistory(bidding);

                }
                await _unitOfWork.SaveChangesAsync(cancellationToken); 
                return Result.Success();
            }

            //Case2 i can't win
            myAutoBid!.MaxBidAmount = maxBixAmount;
            if( maxBixAmount <= maxBidding!.BidAmount)
            {
                var bidding = new BiddingHistory(maxBixAmount, productId, userId);
                _productRepository.AddBiddingHistory(bidding);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success();
            }
            //Case3  Current maxdding keep top
            if ( maxBixAmount <= maxAuto.MaxBidAmount )
            {
                if( maxBidding.BidAmount != maxBixAmount)
                {
                    var topBidding = new BiddingHistory(maxBixAmount,productId, maxBidding.BidderId);
                    _productRepository.AddBiddingHistory(topBidding);
                }
                var bidding = new BiddingHistory(maxBixAmount,productId, userId);
                _productRepository.AddBiddingHistory(bidding);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success();
            }

            //Case4 user win
            if( maxAuto.MaxBidAmount != maxBidding!.BidAmount)
            {
                var other = new BiddingHistory(maxAuto.MaxBidAmount,productId, maxAuto.BidderId);
                _productRepository.AddBiddingHistory(other);
            }

            if( buyNowPrice.HasValue & buyNowPrice!.Value <= maxBixAmount)
            {
                var bidding = new BiddingHistory(buyNowPrice.Value, productId, userId);
                _productRepository.AddBiddingHistory(bidding);
                product.EndDate = DateTime.UtcNow;
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success();
            }

            long myTopPrice = maxAuto.MaxBidAmount + product.StepPrice;

            var newBidding = new BiddingHistory(myTopPrice, productId, userId);
            _productRepository.AddBiddingHistory(newBidding);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}

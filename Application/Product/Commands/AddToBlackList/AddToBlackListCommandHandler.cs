using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.AddToBlackList
{
    public class AddToBlackListCommandHandler : ICommandHandler<AddToBlackListCommand, BlackListDto>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        public AddToBlackListCommandHandler(IProductRepository productRepository,
            IUnitOfWork unitOfWork
            ,IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result<BlackListDto>> Handle(AddToBlackListCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductDetails(request.ProductId, cancellationToken);
            var user = await _userRepository.GetUserById(request.BidderId);
            if (user == null) {
                return Result.Failure<BlackListDto>(new Error("AppUser.NotFound", "User not exists"));
            }
            if (product == null)
            {
                return Result.Failure<BlackListDto>(new Error("Product.NotFound", "Product not exists"));
            }
            var isSelelrOfProduct = product.SellerId == request.SellerId;
            if (!isSelelrOfProduct)
                return Result.Failure<BlackListDto>(new Error("Product.IsNotSeller", "You do not have permission to cancle biddings"));
            var blacklist = await _productRepository.GetBlackListAsync(request.BidderId,
                request.ProductId, cancellationToken);
            if( blacklist is not null)
                return Result.Failure<BlackListDto>(new Error("BlackList.AlreadyAdded", "This user already exists in blacklist"));
            var bl = new BlackList(request.ProductId, request.SellerId, request.BidderId,Guid.NewGuid());
            _productRepository.AddBlackList(bl);
            var top2 = product.BiddingHistories.OrderByDescending(b => b.BidAmount).ThenBy(b=>b.CreatedAt).Where(b=>b.BidderId != request.BidderId).FirstOrDefault();
            if ( product.Winnerid.HasValue && product.Winnerid == request.BidderId)
                {
                if (top2 != null)
                {
                    product.Winnerid = top2.BidderId;
                }
                else
                {
                    product.Winnerid = null;
                }
            }
            await _productRepository.RemoveBidderData(request.BidderId,request.ProductId, cancellationToken);
            product.BlacklistBidder(request.BidderId);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            var dto = new BlackListDto
            {
                CreatedAt = bl.CreatedAt,
                BidderName = user!.FullName,
                SellerId = request.SellerId,
                Id = bl.Id,
            };
            return dto; 
        }
    }
}

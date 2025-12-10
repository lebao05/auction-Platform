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
            var user = await _userRepository.GetUserById(request.BidderId);
            if (user == null) {
                return Result.Failure<BlackListDto>(new Error("AppUser.NotFound", "User not exists"));
            }

            var product = await _productRepository.GetProductDetails(request.SellerId, cancellationToken);
            if (product == null)
                return Result.Failure<BlackListDto>(new Error("Product.NotFound", "Product not exists"));
            var blacklist = product.Blacklists.Where(b => b.BidderId == request.BidderId).FirstOrDefault();
            if( blacklist is not null)
                return Result.Failure<BlackListDto>(new Error("BlackList.AlreadyAdded", "This user already exists in blacklist"));
            var bl = new BlackList(request.ProductId, request.BidderId, request.BidderId,Guid.NewGuid());
            product.Blacklists.Add(bl);
            await _unitOfWork.SaveChangesAsync();
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

using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.CreateProduct
{
    public class CreateProductCommandHandler : ICommandHandler<CreateProductCommand, Guid>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;

        public CreateProductCommandHandler(
            IUnitOfWork unitOfWork,
            IUserRepository userRepository,
            IProductRepository productRepository,
            ICategoryRepository categoryRepository)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<Result<Guid>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            // 1. Validate seller
            var seller = await _userRepository.GetUserById(request.userId);
            if (seller is null)
                return Result.Failure<Guid>(new Error("AppUser.NotFound", "There is no user with the given id."));

            // 2. Validate images
            if (request.ImagePaths is null || request.ImagePaths.Count < 3)
                return Result.Failure<Guid>(new Error("ProductImages.Count", "A product must have at least 3 images."));

            // 3. Validate category
            if(request.CategoryId is not null)
            {
                var categoryExists = await _categoryRepository.GetCategoryById(request.CategoryId.Value, cancellationToken);
                if ( categoryExists is null)
                    return Result.Failure<Guid>(new Error("Category.NotFound", "Category not found when creating product."));

            }
            var buyNowPrice = request.BuyNowPrice;
            // 4. Create product (without images)
            var product = Domain.Entities.Product.Create(
                request.Name,
                buyNowPrice,
                request.AllowAll,
                request.IsAutoRenewal,
                request.StartPrice,
                request.StepPrice,
                request.Description,
                request.Hours,
                seller,
                request.CategoryId
            ); 
            // 5. Add product images
            product.AddImages(request.ImagePaths, request.mainIndex);
            Console.WriteLine("BuyNowPrice after create = " + (product.BuyNowPrice?.ToString() ?? "NULL"));

            // 6. Persist product
            await _productRepository.AddProductAsync(product, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<Guid>.Success(product.Id);
        }
    }
}

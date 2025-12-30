using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Repositories;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Application.Product.Commands.DeleteProduct
{
    public class DeleteProductCommandHandler : ICommandHandler<DeleteProductCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;

        public DeleteProductCommandHandler(
            IProductRepository productRepository,
            IUnitOfWork unitOfWork,
            UserManager<AppUser> userManager)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public async Task<Result> Handle(
            DeleteProductCommand request,
            CancellationToken cancellationToken)
        {
            // 1. Get product
            var product = await _productRepository
                .GetProductAsyncById(request.ProductId, cancellationToken);

            if (product is null)
            {
                return Result.Failure(
                    new Error("Product.NotFound", "There is no product with that id"));
            }

            // 2. Get user (Identity)
            var user = await _userManager.FindByIdAsync(request.UserId.ToString());

            if (user is null)
            {
                return Result.Failure(
                    new Error("User.NotFound", "User not found"));
            }

            // 3. Check role
            bool isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            bool isSeller = product.SellerId == request.UserId;

            if (!isAdmin && !isSeller)
            {
                return Result.Failure(
                    new Error("Product.Unauthorized", "You do not have permission to delete this product"));
            }

            // 4. Delete
            product.IsDeleted = true;
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}

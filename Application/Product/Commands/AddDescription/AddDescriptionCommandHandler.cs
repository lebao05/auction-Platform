using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Product.Commands.AddDescription
{
    public class AddDescriptionCommandHandler : ICommandHandler<AddDescriptionCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductRepository _productRepository;
        public AddDescriptionCommandHandler(IUnitOfWork unitOfWork
            ,IProductRepository productRepository)
        {
            _unitOfWork = unitOfWork;
            _productRepository = productRepository;
        }
        public async Task<Result> Handle(AddDescriptionCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductAsyncById(request.productId,cancellationToken);
            if (product == null)
                return Result.Failure(new Error("Product.NotFound", "Product not exists for adding description"));
            product.AddDesciption(request.description);
            return Result.Success();
        }
    }
}

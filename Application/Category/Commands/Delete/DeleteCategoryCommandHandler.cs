using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Category.Commands.Delete
{
    public class DeleteCategoryCommandHandler : ICommandHandler<DeleteCategoryCommand>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        public DeleteCategoryCommandHandler(IUnitOfWork unitOfWork,ICategoryRepository categoryRepository)
        {
            _unitOfWork = unitOfWork;
            _categoryRepository = categoryRepository;
        }

        public async Task<Result> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var category =  _categoryRepository.GetCategoryWithChilrens( request.Id , cancellationToken).Result;
            if( category == null)
            {
                return Result.Failure(new Error("Category.NotFound", $"Category with Id {request.Id} was not found."));
            }
            bool hasProducts = await _categoryRepository.HasAnyProductInSubtree(request.Id, cancellationToken);
            if( hasProducts)
            {
                return Result.Failure(new Error("Category.HasProducts", $"Category cannot be deleted because it has associated products."));
            }
            var children = category.GetChildrens();
            if (children.Count > 0)
            {
                await _categoryRepository.RemoveRangeAsync(children);
            }
            _categoryRepository.DeleteCategory(category);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

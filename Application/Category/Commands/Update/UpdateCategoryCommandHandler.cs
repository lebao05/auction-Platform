using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Category.Commands.Update
{
    public class UpdateCategoryCommandHandler : ICommandHandler<UpdateCategoryCommand>
    {
        private IUnitOfWork _unitOfWork;
        private ICategoryRepository _categoryRepository;
        public UpdateCategoryCommandHandler(IUnitOfWork unitOfWork,ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            if( request.ParentId is not null )
            {
                var category = await _categoryRepository.GetCategoryById(request.ParentId.Value, cancellationToken);
                if( category == null )
                    return Result.Failure(new Error("Category.NotFound", "Parent category not found."));
                if( category.ParentId is not null )
                    return Result.Failure<Guid>(new Domain.Shared.Error("Category.TooDeep", "Cannot create a sub-category under a sub-category. Only two levels of categories are allowed."));
            }
            var existingCategory = await _categoryRepository.GetCategoryById(request.Id, cancellationToken);
            if( existingCategory == null)
            {
                return Result.Failure(new Error("Category.NotFound", "Category not found."));
            }
            var updateResult = existingCategory.Update(request.Name, request.ParentId);
            if( updateResult.IsFailure )
            {
                return updateResult;
            }
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}

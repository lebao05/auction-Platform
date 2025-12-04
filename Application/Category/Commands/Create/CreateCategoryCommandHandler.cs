using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Category.Commands.Create
{
    public class CreateCategoryCommandHandler : ICommandHandler<CreateCategoryCommand, Guid>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        public CreateCategoryCommandHandler(ICategoryRepository categoryRepository,IUnitOfWork unitOfWork)
        {
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result<Guid>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            if (request.ParentId != null)
            {
                var parent = await _categoryRepository.GetCategoryById(request.ParentId.Value, cancellationToken);
                if( parent == null)
                {
                    return Result.Failure<Guid>(new Domain.Shared.Error("Category.ParentNotFound", "The specified parent category does not exist."));
                }
                if( parent.ParentId != null)
                {
                    return Result.Failure<Guid>(new Domain.Shared.Error("Category.TooDeep", "Cannot create a sub-category under a sub-category. Only two levels of categories are allowed."));
                }
            }
            var category = Domain.Entities.Category.CreateCategory(request.Name, request.ParentId);

            _categoryRepository.AddCategory(category);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success(category.Id);
        }
    }
}

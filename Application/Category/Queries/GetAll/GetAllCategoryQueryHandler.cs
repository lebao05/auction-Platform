using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Category.Queries.GetAll
{
    public class GetAllCategoryQueryHandler : IQueryHandler<GetAllCategoryQuery, List<CategoryDto>>
    {
        private ICategoryRepository _categoryRepository;
        public GetAllCategoryQueryHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }
        public async Task<Result<List<CategoryDto>>> Handle(GetAllCategoryQuery request, CancellationToken cancellationToken)
        {
            var list = await _categoryRepository.GetAllCategoriesWithParent();
            var dtos = list!.Select( c => ToDto(c)).ToList();
            return dtos!;
        }
        private CategoryDto? ToDto(Domain.Entities.Category? c)
        {
            if (c is null) return null;
            return new CategoryDto(
                c.Id,
                c.Name,
                ToDto(c.Parent),
                c.CreatedAt
            );
        }
    }
}

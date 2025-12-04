using Application.Abstractions.Messaging;

namespace Application.Category.Queries.GetAll
{
    public sealed record GetAllCategoryQuery() : IQuery<List<CategoryDto>>;
}

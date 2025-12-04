namespace Application.Category.Queries.GetAll
{
    public record CategoryDto(
        Guid Id,
        string Name,
        CategoryDto? Parent,
        DateTime CreatedAt
    );
}

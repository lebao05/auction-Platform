 namespace Presentation.Contracts.Category
{
    public sealed record UpdateCategoryRequest(string Name,Guid? ParentId);
}

namespace Presentation.Contracts.Category
{
    public class CreateCategoryRequest
    {
        public string Name { get; set; } = null!;
        public Guid? ParentId { get; set; }
    }
}
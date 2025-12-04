using Application.Abstractions.Messaging;

namespace Application.Category.Commands.Create
{
    public sealed record CreateCategoryCommand(string Name, Guid? ParentId) : ICommand<Guid>;
}

using Application.Abstractions.Messaging;

namespace Application.Category.Commands.Update
{
    public sealed record UpdateCategoryCommand(Guid Id,string Name,Guid? ParentId) : ICommand;
}

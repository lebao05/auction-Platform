using Application.Abstractions.Messaging;

namespace Application.Category.Commands.Delete
{
    public sealed record DeleteCategoryCommand(Guid Id) : ICommand;
}

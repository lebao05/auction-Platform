using Application.Abstractions.Messaging;
namespace Application.User.Commands.TriggerRestoringPassword
{
    public record TriggerRestoringPasswordCommand(string Email) : ICommand;
}

using Application.Abstractions.Messaging;

namespace Application.Conversation.Commands.CreateConversation
{
    public sealed record CreateConversationCommand(Guid CurrentUserId,Guid OtherUserId) : ICommand<ConversationCreatedDto>;
}

using Application.Abstractions.Messaging;

namespace Application.Conversation.Commands.SendMessage
{
    public record SendMessageCommand(
        Guid ConversationId,
        Guid SenderId,
        string? Content,
        IReadOnlyList<MessageAttachmentDto> Attachments
    ) : ICommand<MessageDto>;
}

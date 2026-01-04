using Domain.Enums;

namespace Application.Conversation.Commands.SendMessage
{
    public class MessageDto
    {
        public Guid Id { get; init; }
        public Guid ConversationId { get; init; }
        public Guid SenderId { get; init; }
        public string? Content { get; init; }
        public DateTime CreatedAt { get; init; }
        public MessageType MessageType { get; init; }

        public IReadOnlyList<MessageAttachmentDto> Attachments { get; init; } = [];
    }

    public class MessageAttachmentDto
    {
        public string FileUrl { get; init; } = null!;
        public string FileName { get; init; } = null!;
        public FileType FileType { get; init; }
        public long FileSize { get; init; }
        public string? MimeType { get; init; }
    }
}

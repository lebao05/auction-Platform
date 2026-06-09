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
        public static MessageDto CreateMessageDto(Domain.Entities.Message message)
        {
            return new MessageDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                MessageType = message.MessageType,
                Attachments = message.Attachments.Select(att => new MessageAttachmentDto
                {
                    FileUrl = att.FileUrl,
                    FileName = att.FileName,
                    FileType = att.FileType,
                    FileSize = att.FileSize,
                    MimeType = att.MimeType
                }).ToList()
            };
        }
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

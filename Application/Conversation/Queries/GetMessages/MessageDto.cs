using Domain.Enums;
using Domain.Entities;
using System.Linq;

namespace Application.Conversation.Queries.GetMessages
{
    public class MessageDto
    {
        public Guid Id { get; init; }
        public Guid ConversationId { get; init; }

        public Guid SenderId { get; init; }
        public string SenderName { get; init; } = string.Empty;
        public string? SenderAvatarUrl { get; init; }

        public string? Content { get; init; }
        public MessageType MessageType { get; init; }
        public bool IsDeleted { get; init; }

        public DateTime CreatedAt { get; init; }

        public IReadOnlyList<MessageAttachmentDto> Attachments { get; init; }
            = Array.Empty<MessageAttachmentDto>();
    }

    public class MessageAttachmentDto
    {
        public Guid Id { get; init; }
        public string FileUrl { get; init; } = null!;
        public string FileName { get; init; } = null!;
        public long FileSize { get; init; }
        public FileType FileType { get; init; }
        public string? MimeType { get; init; }
    }

    public static class MessageMappings
    {
        public static MessageDto ToDto(this Message message)
        {
            return new MessageDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,

                SenderId = message.SenderId,
                SenderName = message.Sender?.FullName ?? string.Empty,
                SenderAvatarUrl = message.Sender?.AvatarUrl,

                Content = message.Content,
                MessageType = message.MessageType,
                IsDeleted = message.IsDeleted,
                CreatedAt = message.CreatedAt,

                Attachments = message.Attachments
                    .Select(a => new MessageAttachmentDto
                    {
                        Id = a.Id,
                        FileUrl = a.FileUrl,
                        FileName = a.FileName,
                        FileSize = a.FileSize,
                        FileType = a.FileType,
                        MimeType = a.MimeType
                    })
                    .ToList()
            };
        }
    }
}

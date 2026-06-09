using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Message : BaseEntity
    {
        public Guid ConversationId { get; private set; }
        public Conversation Conversation { get; private set; } = null!;

        public Guid SenderId { get; private set; }
        public AppUser Sender { get; private set; } = null!;

        public string? Content { get; private set; }
        public MessageType MessageType { get; private set; }
        public bool IsDeleted { get; private set; }
        public List<MessageReadStatus> ReadStatuses { get; private set; } = new();
        public List<MessageAttachment> Attachments { get; private set; } = new();
        public bool HasAttachments() => Attachments.Any();
        public bool IsReadBy(Guid userId) => ReadStatuses.Any(rs => rs.UserId == userId && rs.ReadAt != null);
        public static Message Create(
            Guid messageId,
            Guid conversationId,
            Guid senderId,
            string? content,
            MessageType messageType)
        {
            return new Message
            {
                Id = messageId,
                ConversationId = conversationId,
                SenderId = senderId,
                Content = content,
                MessageType = messageType,
            };
        }
        public void AddMessageAttachment(MessageAttachment attachment)
        {
            Attachments.Add(attachment);
        }
    }
}

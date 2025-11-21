using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Message : BaseEntity
    {
        public Guid ConversationId { get; set; }
        public Conversation Conversation { get; set; } = null!;

        public Guid SenderId { get; set; }
        public User Sender { get; set; } = null!;

        public string? Content { get; set; }
        public MessageType MessageType { get; set; }
        public bool IsDeleted { get; set; }

        public List<MessageReadStatus> ReadStatuses { get; set; } = new();
        public MessageAttachment Attachments { get; set; } = new();
    }
}

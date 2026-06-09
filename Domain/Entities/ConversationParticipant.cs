using Domain.Common;
using Domain.Enums;
using Domain.Shared;

namespace Domain.Entities
{
    public class ConversationParticipant : BaseEntity
    {
        public Guid ConversationId { get; set; }
        public Conversation Conversation { get; set; } = null!;
        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public DateTime JoinedAt { get; set; }
        public ConversationParticipant(Guid conversationId, AppUser user)
        {
            ConversationId = conversationId;
            UserId = user.Id;
            JoinedAt = DateTime.UtcNow;
            User = user;
        }
        private ConversationParticipant() { } // EF Core

    }
}
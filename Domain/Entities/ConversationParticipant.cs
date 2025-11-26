using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class ConversationParticipant : BaseEntity
    {
        public Guid ConversationId { get; set; }
        public Conversation Conversation { get; set; } = null!;
        public Guid UserId { get; set; }    
        public AppUser User { get; set; } = null!;
        public DateTime JoinedAt { get; set; }
    }
}

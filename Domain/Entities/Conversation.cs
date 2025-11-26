using Domain.Common;

namespace Domain.Entities
{
    public class Conversation : BaseEntity
    {
        public Guid CreatedByUserId { get; set; }
        public AppUser CreatedByUser { get; set; } = null!;

        public List<ConversationParticipant> Participants { get; set; } = new();
        public List<Message> Messages { get; set; } = new();
    }
}

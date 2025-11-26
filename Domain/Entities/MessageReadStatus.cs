using Domain.Common;

namespace Domain.Entities
{
    public class MessageReadStatus : BaseEntity
    {
        public Guid MessageId { get; set; }
        public Message Message { get; set; } = null!;

        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public DateTime? ReadAt { get; set; }
    }
}

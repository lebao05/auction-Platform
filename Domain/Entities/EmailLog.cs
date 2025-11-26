using Domain.Common;
namespace Domain.Entities
{
    public class EmailLog : BaseEntity
    {
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public Guid ReceiverId { get; set; }
        public AppUser Receiver { get; set; } = null!;
    }
}

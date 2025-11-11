using Domain.Common;
using Domain.Enums;

namespace Domain.Entities 
{
    public class SellerRequest :BaseEntity
    {
        public DateTime CreatedAt { get; set; }
        public RequestStatus Status { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}

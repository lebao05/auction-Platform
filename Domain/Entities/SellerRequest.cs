using Domain.Common;

namespace Domain.Entities 
{
    internal class SellerRequest :BaseEntity
    {
        public DateTime CreatedAt { get; set; }
        public RequestStatus Status { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}

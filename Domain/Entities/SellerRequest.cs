using Domain.Common;
using Domain.Enums;
using Domain.Shared;

namespace Domain.Entities 
{
    public class SellerRequest :BaseEntity
    {
        public RequestStatus Status { get; private set; }

        public Guid UserId { get; private set; }
        public AppUser User { get; private set; } = null!;
        public SellerRequest CreateaSellerRequest(Guid sellerRequestId,Guid userId)
        {
            SellerRequest request = new SellerRequest
            {
                UserId = userId,
                Id = sellerRequestId,
                CreatedAt = DateTime.UtcNow,
                Status = RequestStatus.Pending
            };
            return request;
        }

        public void HandleRequest(bool IsAccepted)
        {
            if (IsAccepted)
                Status = RequestStatus.Approved;
            else
                Status = RequestStatus.Rejected;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}

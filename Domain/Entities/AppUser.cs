using Domain.Common;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class AppUser : IdentityUser<Guid>
    {
        public AppUser()
        {
            
        }
        public AppUser(string fullname,string email,string username,string address)
        {
            UserName = username;
            FullName = fullname;
            Email = email;
            Address = address;
        }
        public string FullName { get; private set; } = string.Empty;
        public string Address { get; private set; } = string.Empty;
        public string? AvatarUrl { get; private set; } = string.Empty;
        public DateTime? DateOfBirth { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public ICollection<Product> ProductsAsSeller { get; private set; } = new List<Product>();
        public ICollection<BiddingHistory> BiddingHistories { get; private set; } = new List<BiddingHistory>();
        public ICollection<Rating> RatingsGiven { get; private set; } = new List<Rating>();
        public ICollection<Rating> RatingsReceived { get; private set; } = new List<Rating>();
        public ICollection<Comment> CommentsAsReplier { get;private set; } = new List<Comment>();
        public ICollection<ConversationParticipant> ConversationParticipants { get; private set; } = new List<ConversationParticipant>();
        //public ICollection<Blacklist> BlacklistedIn { get; set; } = new List<Blacklist>();
        //public ICollection<OrderCompletion> OrdersAsSeller { get; set; } = new List<OrderCompletion>();
        //public ICollection<OrderCompletion> OrdersAsBuyer { get; set; } = new List<OrderCompletion>();
        //public ICollection<OrderChatMessage> SentMessages { get; set; } = new List<OrderChatMessage>();
        public ICollection<SellerRequest> SellerRequests { get; private set; } = new List<SellerRequest>();


        public Result UpdateInfo(
            string fullName,
            string? phoneNumber = null,
            string address = null!,
            string? avatarUrl = null,
            DateTime? dateOfBirth = null)
        {
            if (string.IsNullOrWhiteSpace(fullName))
                return Result.Failure(new Error("AppUser.UpdatingInfo", "Fullname can not be empty"));
            FullName = fullName!;

            PhoneNumber = phoneNumber;

            if (string.IsNullOrWhiteSpace(address))
                return Result.Failure(new Error("AppUser.UpdatingInfo", "Address can not be empty"));

            Address = address!;

            AvatarUrl = avatarUrl;

            if (dateOfBirth.HasValue)
                DateOfBirth = dateOfBirth.Value;

            UpdatedAt = DateTime.UtcNow;
            return Result.Success();
        }
    }
}

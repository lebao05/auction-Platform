using Domain.Common;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class AppUser : IdentityUser<Guid>
    {
        public AppUser()
        {
            
        }
        public AppUser(string fullname,string email,string username)
        {
            UserName = username;
            FullName = fullname;
            Email = email;
        }
        public string FullName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public ICollection<Product> ProductsAsSeller { get; set; } = new List<Product>();
        public ICollection<BiddingHistory> BiddingHistories { get; set; } = new List<BiddingHistory>();
        public ICollection<Rating> RatingsGiven { get; set; } = new List<Rating>();
        public ICollection<Rating> RatingsReceived { get; set; } = new List<Rating>();
        public ICollection<Comment> CommentsAsReplier { get;set; } = new List<Comment>();
        public ICollection<ConversationParticipant> ConversationParticipants { get; set; } = new List<ConversationParticipant>();
        //public ICollection<Blacklist> BlacklistedIn { get; set; } = new List<Blacklist>();
        //public ICollection<OrderCompletion> OrdersAsSeller { get; set; } = new List<OrderCompletion>();
        //public ICollection<OrderCompletion> OrdersAsBuyer { get; set; } = new List<OrderCompletion>();
        //public ICollection<OrderChatMessage> SentMessages { get; set; } = new List<OrderChatMessage>();
        public SellerRequest? SellerRequest { get; set; }

    }
}

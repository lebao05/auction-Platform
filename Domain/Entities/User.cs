using Domain.Common;

namespace Domain.Entities
{
    public class User : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool IsEmailConfirmed { get; set; }
        public ICollection<Product> ProductsAsseller { get; set; } = new List<Product>();
        public ICollection<BiddingHistory> BiddingHistories { get; set; } = new List<BiddingHistory>();
        public ICollection<Rating> RatingsGiven { get; set; } = new List<Rating>();
        public ICollection<Rating> RatingsReceived { get; set; } = new List<Rating>();
        public ICollection<Blacklist> BlacklistedIn { get; set; } = new List<Blacklist>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public SellerRequest? SellerRequest { get; set; }
    }
}

using Domain.Common;

namespace Domain.Entities
{
    internal class Comment :BaseEntity
    {
        public string Content { get; set; } = string.Empty;
        public CommentType Type { get; set; }

        public int? ParentId { get; set; }
        public Comment? Parent { get; set; }
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}

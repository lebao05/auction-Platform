using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Comment :BaseEntity
    {
        public string Content { get; set; } = string.Empty;
        public CommentType Type { get; set; }

        public Guid? ParentId { get; set; }
        public Comment? Parent { get; set; }
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}

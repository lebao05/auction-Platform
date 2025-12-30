using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Comment :BaseEntity
    {
        public string Content { get; set; } = string.Empty;
        public Guid? ParentId { get; set; }
        public Comment? Parent { get; set; }
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();

        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public Comment(
            string content,
            Guid userId,
            Guid productId,
            Guid? parentId = null
        )
        {
            Content = content;
            UserId = userId;
            ProductId = productId;
            ParentId = parentId;
        }
    }
}

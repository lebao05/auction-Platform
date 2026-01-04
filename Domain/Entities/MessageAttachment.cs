using Domain.Common;
using Domain.Enums;
using System.Net.Mime;

namespace Domain.Entities
{
    public class MessageAttachment : BaseEntity    
    {
        public Guid MessageId { get; set; }
        public Message Message { get; set; } = null!;
        public string FileUrl { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public long FileSize { get; set; }
        public FileType FileType { get; set; }
        public string? MimeType { get; set; }
    }
}

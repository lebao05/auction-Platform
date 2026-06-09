using Microsoft.AspNetCore.Http;

namespace Presentation.Contracts.Conversation
{
    public class SendMessageRequest
    {
        public Guid ConversationId { get; set; }
        public string? Content { get; set; }

        public List<IFormFile>? Files { get; set; }
    }
}

using Domain.Enums;

namespace Application.Conversation.Queries.GetConversations
{
    public class ConversationSummaryDto
    {
        public Guid Id { get; init; }
        public Guid? OtherParticipantId { get; init; }
        public string OtherFullName { get; init; } = null!;
        public string? OtherAvatarUrl { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime? LastMessageAt { get; init; }
        public MessageDto? LastMessagePreview { get; init; }

        public static ConversationSummaryDto CreateConversationSummaryDto(
            Guid id,
            Guid? otherParticipantId,
            string otherFullName,
            string? otherAvatarUrl,
            DateTime createdAt,
            DateTime? lastMessageAt,
            MessageDto? lastMessagePreview)
        {
            return new ConversationSummaryDto
            {
                Id = id,
                OtherParticipantId = otherParticipantId,
                OtherFullName = otherFullName,
                OtherAvatarUrl = otherAvatarUrl,
                CreatedAt = createdAt,
                LastMessageAt = lastMessageAt,
                LastMessagePreview = lastMessagePreview
            };
        }
    }

    public class MessageDto
    {
        public Guid SenderId { get; init; }
        public string? Content { get; init; }
        public DateTime CreatedAt { get; init; }
        public MessageType MessageType { get; init; }
    }
}

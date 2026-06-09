
namespace Application.Conversation.Queries.GetConversationDetail
{
    public class ConversationDetailDto
    {
        public Guid Id { get; init; }
        public bool IsOneOnOne { get; init; }
        public IReadOnlyList<ConversationParticipantDto> Participants { get; init; } = [];
    }
    public class ConversationParticipantDto
    {
        public Guid UserId { get; init; }
        public string FullName { get; init; } = null!;
        public string? AvatarUrl { get; init; }
        public DateTime JoinedAt { get; init; }
    }
}

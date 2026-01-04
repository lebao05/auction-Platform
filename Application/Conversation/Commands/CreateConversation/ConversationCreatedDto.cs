using Domain.Entities;

namespace Application.Conversation.Commands.CreateConversation
{
    public class ConversationCreatedDto
    {
        public Guid Id { get; init; }
        public bool IsOneOnOne { get; init; }
        public IReadOnlyList<ConversationParticipantDto> Participants { get; init; } = [];
        public DateTime CreatedAt { get; init; }
    }

    public class ConversationParticipantDto
    {
        public Guid UserId { get; init; }
        public string FullName { get; init; } = null!;
        public string? AvatarUrl { get; init; }
        public DateTime JoinedAt { get; init; }
    }

    public static class ConversationCreatedDtoMapper
    {
        public static ConversationCreatedDto ToCreatedDto(this Domain.Entities.Conversation conversation)
        {
            return new ConversationCreatedDto
            {
                Id = conversation.Id,
                IsOneOnOne = true,
                CreatedAt = conversation.CreatedAt,
                Participants = conversation.Participants
                    .Select(p => new ConversationParticipantDto
                    {
                        UserId = p.UserId,
                        JoinedAt = p.JoinedAt
                    })
                    .ToList()
            };
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Conversation.Queries.GetConversationWithOther
{
    public class ConversationDetailDto
    {
        public Guid Id { get; init; }              // EMPTY if virtual
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

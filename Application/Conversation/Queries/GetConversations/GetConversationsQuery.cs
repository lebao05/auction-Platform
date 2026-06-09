using Application.Abstractions.Messaging;

namespace Application.Conversation.Queries.GetConversations
{
    public sealed record GetConversationsQuery(Guid CurrentUserId)
        : IQuery<IReadOnlyList<ConversationSummaryDto>>;
}

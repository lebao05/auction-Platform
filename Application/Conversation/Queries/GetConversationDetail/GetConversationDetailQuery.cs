using Application.Abstractions.Messaging;
namespace Application.Conversation.Queries.GetConversationDetail
{
    public record GetConversationDetailQuery(
        Guid ConversationId,
        Guid UserId)
        : IQuery<ConversationDetailDto>;
}

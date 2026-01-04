using Application.Abstractions.Messaging;
namespace Application.Conversation.Queries.GetConversationWithOther
{
        public record GetConversationWithOther(
            Guid CurrentUserId,
            Guid OtherUserId
        ) : IQuery<ConversationDetailDto>;
}

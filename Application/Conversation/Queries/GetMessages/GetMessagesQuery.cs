using Application.Abstractions.Messaging;
namespace Application.Conversation.Queries.GetMessages
{
    public record GetMessagesQuery(
     Guid ConversationId,
     Guid UserId,
     int Offset,
     int Limit
 ) : IQuery<List<MessageDto>>;
}

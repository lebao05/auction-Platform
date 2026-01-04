using Domain.Entities;

namespace Domain.Repositories
{
    public interface IConversationRepository
    {
        void CreateConversation(Conversation conversation);
        Task<Conversation?> GetOneOnOneAsync(
           Guid userId1,
           Guid userId2,
           CancellationToken cancellationToken);
        Task<IReadOnlyList<Conversation>> GetUserConversationsAsync(
            Guid userId,
            CancellationToken cancellationToken);
        Task<Conversation?> GetConversationDetailAsync(
            Guid conversationId,
            CancellationToken cancellationToken);

        Task<List<Message>> GetMessagesAsync(
            Guid conversationId,
            int offset,
            int limit,
            CancellationToken cancellationToken);
        Task<bool> IsUserParticipantAsync(
           Guid conversationId,
           Guid userId,
           CancellationToken cancellationToken);
        void AddMessage(Message message);
        Task<Conversation?> GetByIdAsync(
            Guid conversationId,
            CancellationToken cancellationToken);
    }
}

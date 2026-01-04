using Domain.Entities;
using Domain.Repositories;
using Infraestructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Persistence.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly ApplicationDbContext _appDbContext;
        public ConversationRepository(ApplicationDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public void CreateConversation(Conversation conversation)
        {
            _appDbContext.Conversations.Add(conversation);
        }
        public async Task<Conversation?> GetOneOnOneAsync(
            Guid userId1,
            Guid userId2,
            CancellationToken cancellationToken)
        {
            return await _appDbContext.Conversations
                .Include(c => c.Participants)
                    .ThenInclude(c=>c.User)
                .Where(c => c.Participants.Count == 2)
                .FirstOrDefaultAsync(c =>
                    c.Participants.Any(p => p.UserId == userId1) &&
                    c.Participants.Any(p => p.UserId == userId2),
                    cancellationToken);
        }
        public async Task<IReadOnlyList<Conversation>> GetUserConversationsAsync(
            Guid userId,
            CancellationToken cancellationToken)
        {
            return await _appDbContext.Conversations
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt))
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .ToListAsync(cancellationToken);
        }
        public async Task<Conversation?> GetConversationDetailAsync(
            Guid conversationId,
            CancellationToken cancellationToken)
        {
            return await _appDbContext.Conversations
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(
                    c => c.Id == conversationId,
                    cancellationToken);
        }

        public async Task<List<Message>> GetMessagesAsync(
            Guid conversationId,
            int offset,
            int limit,
            CancellationToken cancellationToken)
        {
            return await _appDbContext.Messages
                .Where(m => m.ConversationId == conversationId && !m.IsDeleted)
                .Include(m => m.Sender)
                .Include(m => m.Attachments)
                .OrderByDescending(m => m.CreatedAt)
                .Skip(offset)
                .Take(limit)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
        public async Task<bool> IsUserParticipantAsync(
            Guid conversationId,
            Guid userId,
            CancellationToken cancellationToken)
        {
            return await _appDbContext.ConversationParticipants
                .AnyAsync(cp =>
                    cp.ConversationId == conversationId &&
                    cp.UserId == userId,
                    cancellationToken);
        }
        public void AddMessage(Message message)
        {
            _appDbContext.Messages.Add(message);
        }
        public async Task<Conversation?> GetByIdAsync(
            Guid conversationId,
            CancellationToken cancellationToken)
        {
            return await _appDbContext.Conversations
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(
                    c => c.Id == conversationId,
                    cancellationToken);
        }
    }
}

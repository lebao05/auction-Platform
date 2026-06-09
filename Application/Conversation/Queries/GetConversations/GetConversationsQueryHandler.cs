using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Conversation.Queries.GetConversations
{
    public class GetConversationsQueryHandler
          : IQueryHandler<GetConversationsQuery, IReadOnlyList<ConversationSummaryDto>>
    {
        private readonly IConversationRepository _conversationRepository;

        public GetConversationsQueryHandler(
            IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }

        public async Task<Result<IReadOnlyList<ConversationSummaryDto>>> Handle(
            GetConversationsQuery request,
            CancellationToken cancellationToken)
        {
            var conversations = await _conversationRepository
                .GetUserConversationsAsync(
                    request.CurrentUserId,
                    cancellationToken);

            var result = conversations
                .Select(c => new ConversationSummaryDto
                {
                    Id = c.Id,
                    OtherParticipantId = c.GetOtherParticipant(request.CurrentUserId).Id,
                    OtherAvatarUrl = c.GetOtherParticipant(request.CurrentUserId).AvatarUrl,
                    OtherFullName = c.GetOtherParticipant(request.CurrentUserId).FullName,
                    CreatedAt = c.CreatedAt,
                    LastMessageAt = c.Messages
                        .OrderByDescending(m => m.CreatedAt)
                        .FirstOrDefault()
                        ?.CreatedAt,
                    LastMessagePreview = c.Messages
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => new MessageDto
                        {
                            SenderId = m.SenderId,
                            Content = m.Content,
                            MessageType = m.MessageType,
                            CreatedAt = m.CreatedAt
                        })
                        .FirstOrDefault()
                })
                .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
                .ToList();

            return Result.Success<IReadOnlyList<ConversationSummaryDto>>(result);
        }
    }
    
}

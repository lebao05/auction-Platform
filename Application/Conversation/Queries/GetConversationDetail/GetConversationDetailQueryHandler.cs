using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Conversation.Queries.GetConversationDetail
{
    internal sealed class GetConversationDetailQueryHandler
        : IQueryHandler<GetConversationDetailQuery, ConversationDetailDto>
    {
        private readonly IConversationRepository _conversationRepository;

        public GetConversationDetailQueryHandler(
            IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }

        public async Task<Result<ConversationDetailDto>> Handle(
            GetConversationDetailQuery request,
            CancellationToken cancellationToken)
        {
            var conversation = await _conversationRepository
                .GetConversationDetailAsync(
                    request.ConversationId,
                    cancellationToken);

            if (conversation == null)
            {
                return Result.Failure<ConversationDetailDto>(
                    new Error(
                        "Conversation.NotFound",
                        "Conversation was not found."
                    ));
            }

            // Authorization: user must be a participant
            if (!conversation.Participants.Any(p => p.UserId == request.UserId))
            {
                return Result.Failure<ConversationDetailDto>(
                    new Error(
                        "Conversation.Forbidden",
                        "You are not a participant of this conversation."
                    ));
            }

            var dto = new ConversationDetailDto
            {
                Id = conversation.Id,
                IsOneOnOne = true,
                Participants = conversation.Participants
                    .Select(p => new ConversationParticipantDto
                    {
                        UserId = p.UserId,
                        FullName = p.User.FullName,
                        AvatarUrl = p.User.AvatarUrl,
                        JoinedAt = p.JoinedAt
                    })
                    .ToList()
            };

            return Result.Success(dto);
        }
    }
}

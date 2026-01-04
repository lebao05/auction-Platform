using Application.Abstractions.Messaging;
using Application.Conversation.Queries.GetConversationDetail;
using Domain.Repositories;
using Domain.Shared;
using MediatR;


namespace Application.Conversation.Queries.GetMessages
{
    public sealed class GetMessagesQueryHandler : IQueryHandler<GetMessagesQuery, List<MessageDto>>
    {
        private readonly IConversationRepository _conversationRepository;

        public GetMessagesQueryHandler(IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }

        public async Task<Result<List<MessageDto>>> Handle(
            GetMessagesQuery request,
            CancellationToken cancellationToken)
        {
            var isParticipant =
            await _conversationRepository.IsUserParticipantAsync(
                request.ConversationId,
                request.UserId,
                cancellationToken);

            if (!isParticipant)
            {
                return Result.Failure<List<MessageDto>>(
                    new Error(
                        "Conversation.Forbidden",
                        "You are not a participant of this conversation."
                    ));
            }
            var messages = await _conversationRepository.GetMessagesAsync(
                request.ConversationId,
                request.Offset,
                request.Limit,
                cancellationToken);

            return messages
                .Select(m => m.ToDto())
                .ToList();
        }
    }
}

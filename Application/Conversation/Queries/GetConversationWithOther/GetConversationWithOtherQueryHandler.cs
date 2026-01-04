using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;
namespace Application.Conversation.Queries.GetConversationWithOther
{
    internal sealed class GetConversationWithOtherQueryHandler
        : IQueryHandler<GetConversationWithOther, ConversationDetailDto>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUserRepository _userRepository;

        public GetConversationWithOtherQueryHandler(
            IConversationRepository conversationRepository,
            IUserRepository userRepository)
        {
            _conversationRepository = conversationRepository;
            _userRepository = userRepository;
        }

        public async Task<Result<ConversationDetailDto>> Handle(
            GetConversationWithOther request,
            CancellationToken cancellationToken)
        {
            // 1️⃣ Try to find existing one-on-one conversation
            var conversation = await _conversationRepository
                .GetOneOnOneAsync(
                    request.CurrentUserId,
                    request.OtherUserId,
                    cancellationToken);

            if (conversation != null)
            {
                return Result.Success(new ConversationDetailDto
                {
                    Id = conversation.Id,
                    IsOneOnOne = true,
                    Participants = conversation.Participants.Select(p => new ConversationParticipantDto
                    {
                        UserId = p.UserId,
                        FullName = p.User.FullName,
                        AvatarUrl = p.User.AvatarUrl,
                        JoinedAt = p.JoinedAt
                    }).ToList()
                });
            }

            // 2️⃣ Conversation NOT exists → create virtual conversation for the UI
            var currentUser = await _userRepository
                .GetUserById(request.CurrentUserId, cancellationToken);

            var otherUser = await _userRepository
                .GetUserById(request.OtherUserId, cancellationToken);

            if (currentUser == null || otherUser == null)
            {
                return Result.Failure<ConversationDetailDto>(
                    new Error("Conversation.NotFound", "User not found"));
            }

            var now = DateTime.UtcNow;

            return Result.Success(new ConversationDetailDto
            {
                Id = Guid.Empty, 
                IsOneOnOne = true,
                Participants = new List<ConversationParticipantDto>
                {
                    new()
                    {
                        UserId = currentUser.Id,
                        FullName = currentUser.FullName,
                        AvatarUrl = currentUser.AvatarUrl,
                        JoinedAt = now
                    },
                    new()
                    {
                        UserId = otherUser.Id,
                        FullName = otherUser.FullName,
                        AvatarUrl = otherUser.AvatarUrl,
                        JoinedAt = now
                    }
                }
            });
        }
    }
}
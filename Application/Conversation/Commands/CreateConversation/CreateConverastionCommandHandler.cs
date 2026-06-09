using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Repositories;
using Domain.Shared;
using Domain.Entities;

namespace Application.Conversation.Commands.CreateConversation
{
    public class CreateConversationCommandHandler
           : ICommandHandler<CreateConversationCommand, ConversationCreatedDto>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;

        public CreateConversationCommandHandler(
            IConversationRepository conversationRepository,
            IUnitOfWork unitOfWork,
            IUserRepository userRepository  )
        {
            _conversationRepository = conversationRepository;
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
        }

        public async Task<Result<ConversationCreatedDto>> Handle(
            CreateConversationCommand request,
            CancellationToken cancellationToken)
        {
            // Check if one-on-one already exists
            var existingConversation =
                await _conversationRepository
                    .GetOneOnOneAsync(
                        request.CurrentUserId,
                        request.OtherUserId,
                        cancellationToken);

            if (existingConversation != null)
                return existingConversation.ToCreatedDto();

            var user =
                await _userRepository.GetUserById(
                    request.CurrentUserId,
                    cancellationToken);
            if (user == null) {
                return Result.Failure<ConversationCreatedDto>(
                    new Error(
                        "User.NotFound",
                        $"User with ID {request.CurrentUserId} was not found."));
            }
            var other =
                await _userRepository.GetUserById(
                    request.OtherUserId,
                    cancellationToken);
            if (other == null) {
                return Result.Failure<ConversationCreatedDto>(
                    new Error(
                        "User.NotFound",
                        $"User with ID {request.OtherUserId} was not found."));
            }
            var conversation = Domain.Entities.Conversation.CreateOneOnOne(
                user,
                other);
            if (conversation.IsFailure)
                return Result.Failure<ConversationCreatedDto>(conversation.Error);
            _conversationRepository.CreateConversation(conversation.Value);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return conversation.Value.ToCreatedDto();
        }
    }
}

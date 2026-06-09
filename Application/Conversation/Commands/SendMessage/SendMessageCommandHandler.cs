using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using Domain.Shared;

namespace Application.Conversation.Commands.SendMessage
{
    internal sealed class SendMessageCommandHandler
         : ICommandHandler<SendMessageCommand, MessageDto>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public SendMessageCommandHandler(
            IConversationRepository conversationRepository,
            IUnitOfWork unitOfWork)
        {
            _conversationRepository = conversationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<MessageDto>> Handle(
            SendMessageCommand request,
            CancellationToken cancellationToken)
        {
            var conversation = await _conversationRepository
                .GetByIdAsync(request.ConversationId, cancellationToken);

            if (conversation == null)
                return Result.Failure<MessageDto>(
                    new Error("Conversation.NotFound", "Conversation not found"));

            if (!conversation.Participants.Any(p => p.UserId == request.SenderId))
                return Result.Failure<MessageDto>(
                    new Error("Conversation.Forbidden", "You are not a participant"));

            var message = Message.Create(
                Guid.NewGuid(),
                request.ConversationId,
                request.SenderId,
                request.Content,
                request.Attachments.Any()
                    ? MessageType.File
                    : MessageType.Text);

            foreach (var att in request.Attachments)
            {
                message.AddMessageAttachment(
                    MessageAttachment.CreateMessageAttactment(
                        message.Id,
                        att.FileUrl,
                        att.FileName,
                        att.FileSize,
                        att.FileType,
                        att.MimeType));
            }

            _conversationRepository.AddMessage(message);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return MessageDto.CreateMessageDto(message);
        }
    }
}

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
            var isMember = await _conversationRepository
                .IsUserParticipantAsync(
                    request.ConversationId,
                    request.SenderId,
                    cancellationToken);

            if (!isMember)
            {
                return Result.Failure < MessageDto > (
                    new Error("Conversation.Forbidden", "User is not part of this conversation"));
            }
            var message = new Message
            {
                Id = Guid.NewGuid(),
                ConversationId = request.ConversationId,
                SenderId = request.SenderId,
                Content = request.Content,
                MessageType = request.Attachments.Any()
                    ? MessageType.File
                    : MessageType.Text
            };

            foreach (var att in request.Attachments)
            {
                message.Attachments.Add(new MessageAttachment
                {
                    MessageId = message.Id,
                    FileUrl = att.FileUrl,
                    FileName = att.FileName,
                    FileSize = att.FileSize,
                    FileType = att.FileType,
                    MimeType = att.MimeType
                });
            }

            _conversationRepository.AddMessage(message);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new MessageDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                Content = message.Content,
                MessageType = message.MessageType,
                CreatedAt = message.CreatedAt,
                Attachments = request.Attachments
            };
        }
    }
    }

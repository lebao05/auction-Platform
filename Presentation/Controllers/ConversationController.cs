using Application.Abstractions;
using Application.Conversation.Commands.CreateConversation;
using Application.Conversation.Commands.SendMessage;
using Application.Conversation.Queries.GetConversationDetail;
using Application.Conversation.Queries.GetConversations;
using Application.Conversation.Queries.GetConversationWithOther;
using Application.Conversation.Queries.GetMessages;
using Domain.Enums;
using Infraestructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Presentation.Abstractions;
using Presentation.Contracts.Conversation;
using Presentation.SignalR;

namespace Presentation.Controllers
{
    [Route("api/conversation")]
    public class ConversationController : ApiController
    {
        private readonly IFileStorageService _fileStorage;
        private readonly IHubContext<ChatHub> _chatHub;
        private readonly IPresenceTracker _presenceTracker;
        public ConversationController(
                ISender sender,
                IFileStorageService fileStorage,
                IHubContext<ChatHub> chatHub,
                IPresenceTracker presenceTracker)
                : base(sender)
        {
            _fileStorage = fileStorage;
            _chatHub = chatHub;
            _presenceTracker = presenceTracker;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateConversation([FromBody] CreateConversationRequest request, 
            CancellationToken cancellationToken)
        {
            var userId = Guid.Parse(ClaimsPrincipalExtensions.GetUserId(User));
            var result = await _sender.Send(new CreateConversationCommand(userId,request.AnotherId),cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            foreach (var member in result.Value.Participants)
            {
                var connections = await _presenceTracker.GetConnectionsForUser(member.UserId.ToString());
                foreach (var connectionId in connections)
                {
                    await _chatHub.Groups.AddToGroupAsync(connectionId, result.Value.Id.ToString());
                }
            }
            return Ok(result.Value);
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetConversations(
            CancellationToken cancellationToken)
        {
            var userId = Guid.Parse(ClaimsPrincipalExtensions.GetUserId(User));

            var result = await _sender.Send(
                new GetConversationsQuery(userId),
                cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }
        [Authorize]
        [HttpGet("{conversationId:guid}")]
        public async Task<IActionResult> GetConversationDetail(
            Guid conversationId,
            CancellationToken cancellationToken)
        {
            var userId = Guid.Parse(ClaimsPrincipalExtensions.GetUserId(User));

            var result = await _sender.Send(
                new GetConversationDetailQuery(conversationId, userId),
                cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }
        [Authorize]
        [HttpGet("{conversationId:guid}/messages")]
        public async Task<IActionResult> GetMessages(
            Guid conversationId,
            [FromQuery] int offset = 0,
            [FromQuery] int limit = 20,
            CancellationToken cancellationToken = default)
        {
            var userId = Guid.Parse(ClaimsPrincipalExtensions.GetUserId(User));

            var result = await _sender.Send(
                new GetMessagesQuery(
                    conversationId,
                    userId,
                    offset,
                    limit),
                cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }
        [Authorize]
        [HttpPost("{conversationId:guid}/messages")]
        public async Task<IActionResult> SendMessage(
          Guid conversationId,
          [FromForm] SendMessageRequest request,
          CancellationToken cancellationToken)
        {
            var userId = Guid.Parse(ClaimsPrincipalExtensions.GetUserId(User));

            var attachments = new List<Application.Conversation.Commands.SendMessage.MessageAttachmentDto>();

            if (request.Files != null && request.Files.Count > 0)
            {
                foreach (var file in request.Files)
                {
                    await using var stream = file.OpenReadStream();

                    var fileUrl = await _fileStorage.UploadFileAsync(
                        stream,
                        $"{Guid.NewGuid()}_{file.FileName}",
                        cancellationToken);

                    attachments.Add(new Application.Conversation.Commands.SendMessage.MessageAttachmentDto
                    {
                        FileUrl = fileUrl,
                        FileName = file.FileName,
                        FileSize = file.Length,
                        FileType = FileType.Other, // or detect by mime
                        MimeType = file.ContentType
                    });
                }
            }

            var result = await _sender.Send(
                new SendMessageCommand(
                    conversationId,
                    userId,
                    request.Content,
                    attachments),
                cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            // 🔔 SignalR push to conversation group
            await _chatHub.Clients
                .Group(conversationId.ToString())
                .SendAsync("NewMessage", result.Value, cancellationToken);

            return Ok(result.Value);
        }
        [Authorize]
        [HttpGet("with/{otherUserId:guid}")]
        public async Task<IActionResult> GetConversationWithUser(
            Guid otherUserId,
            CancellationToken cancellationToken)
        {
            var currentUserId = Guid.Parse(ClaimsPrincipalExtensions.GetUserId(User));
            var result = await _sender.Send(
                new GetConversationWithOther(currentUserId, otherUserId),
                cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }
    }
}

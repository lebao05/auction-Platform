using Application.Conversation.Queries.GetConversations;
using Infraestructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
namespace Presentation.SignalR
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        private readonly IPresenceTracker _presenceTracker;

        public ChatHub(IMediator mediator,
            IPresenceTracker presenceTracker
            )
        {
            _presenceTracker = presenceTracker;
            _mediator = mediator;
        }

        public override async Task OnConnectedAsync()
        {
            if ( Context.User is null )
            {
                return;
            }
            var userId = ClaimsPrincipalExtensions.GetUserId(Context.User!);
            
            var result = await _mediator.Send(new GetConversationsQuery(Guid.Parse(userId!)));
            if (result != null)
            {
                foreach (var conversation in result.Value)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, conversation.Id.ToString());
                }
            }
            bool isOnline = await _presenceTracker.UserConnected(userId, Context.ConnectionId);
            var userOnlines = await _presenceTracker.GetOnlineUsers();
            await Clients.Client(Context.ConnectionId).SendAsync("IntialUsersOnline", userOnlines);
            if (isOnline)
            {
                await Clients.Others.SendAsync("UserIsOnline", userId);
            }
             await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if( Context.User == null) 
            {
                await base.OnDisconnectedAsync(exception);
                return;
            }
            var userId = ClaimsPrincipalExtensions.GetUserId(Context.User!);
            if (!string.IsNullOrEmpty(userId))
            {
            }
            bool isOnline = await _presenceTracker.UserDisconnected(userId, Context.ConnectionId);
            if (!isOnline)
            {
                await Clients.Others.SendAsync("UserIsOffline", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}

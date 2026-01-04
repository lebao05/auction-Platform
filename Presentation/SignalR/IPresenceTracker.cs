namespace Presentation.SignalR
{
    public interface IPresenceTracker
    {
        Task<bool> UserConnected(string userId, string connectionId);
        Task<bool> UserDisconnected(string userId, string connectionId);
        Task<string[]> GetConnectionsForUser(string userId);

        Task AddToGroup(string groupName, string userId);
        Task<string[]> GetOnlineUsers();

    }
}

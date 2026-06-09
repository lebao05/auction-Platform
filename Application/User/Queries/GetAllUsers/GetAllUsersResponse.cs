namespace Application.User.Queries.GetAllUsers
{
    public class GetAllUsersResponse
    {
        public Guid Id { get; init; }

        public string Email { get; init; } = null!;
        public string FullName { get; init; } = null!;
       
        public DateTime CreatedAt { get; init; }
        public string Role { get; init; } = null!;
    }
}

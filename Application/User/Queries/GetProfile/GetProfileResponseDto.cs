namespace Application.User.Queries.GetProfile
{
    public class GetProfileResponseDto
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;

        public DateTime? DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }

        public int TotalRatingsReceived { get; set; } = 0;
        public double AverageRating { get; set; } = 0.0;
    }
}

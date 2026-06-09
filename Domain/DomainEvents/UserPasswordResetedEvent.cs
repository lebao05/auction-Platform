using Domain.Common;

namespace Domain.DomainEvents
{
    public class UserPasswordResetedEvent: IDomainEvent
    {
        public Guid UserId { get; set; }
        public string Password { get; set; } = null!;
        public UserPasswordResetedEvent(
            Guid UserId,
            string Password)
        {
            this.UserId = UserId;
            this.Password = Password;   
        }
    }
}

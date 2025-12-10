using MediatR;

namespace Domain.Common
{
    public abstract class BaseEntity : IEquatable<BaseEntity>
    {
        public Guid Id { get; init; }
        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; }

        private readonly List<IDomainEvent> _domainEvents = new();

        public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents;

        public void AddDomainEvent(IDomainEvent eventItem)
            => _domainEvents.Add(eventItem);

        public void ClearDomainEvents()
            => _domainEvents.Clear();

        protected BaseEntity()
        {
            Id = Guid.NewGuid();   
        }
        protected BaseEntity(Guid id)
        {
            Id = id;
            CreatedAt = DateTime.UtcNow;
        }
        public bool Equals(BaseEntity? other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;
            return Id.Equals(other.Id);
        }
        public override bool Equals(object? obj)
        {
            if (obj is null) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((BaseEntity)obj);
        }
        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}

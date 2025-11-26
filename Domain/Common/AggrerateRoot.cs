namespace Domain.Common
{
    public abstract class AggrerateRoot : BaseEntity
    {
        private readonly List<IDomainEvent> _domainEvents = new();

        protected AggrerateRoot(Guid id)
            : base(id)
        {
        }

        protected AggrerateRoot()
        {
        }

        public IReadOnlyCollection<IDomainEvent> GetDomainEvents() => _domainEvents.ToList();

        public void ClearDomainEvents() => _domainEvents.Clear();

        protected void RaiseDomainEvent(IDomainEvent domainEvent) =>
            _domainEvents.Add(domainEvent);
    }
}

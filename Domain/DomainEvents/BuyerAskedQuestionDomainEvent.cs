using Domain.Common;

namespace Domain.DomainEvents
{
    public sealed class BuyerAskedQuestionDomainEvent : IDomainEvent
    {
        public Guid ProductId { get; }
        public Guid QuestionId { get; }
        public Guid BuyerId { get; }

        public BuyerAskedQuestionDomainEvent(
            Guid productId,
            Guid questionId,
            Guid buyerId)
        {
            ProductId = productId;
            QuestionId = questionId;
            BuyerId = buyerId;
        }
    }
}

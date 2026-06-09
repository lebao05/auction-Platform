using Domain.Common;

namespace Domain.DomainEvents
{
    public sealed class SellerRepliedToQuestionDomainEvent : IDomainEvent
    {
        public Guid ProductId { get; }
        public Guid QuestionId { get; }
        public Guid SellerId { get; }

        public SellerRepliedToQuestionDomainEvent(
            Guid productId,
            Guid questionId,
            Guid sellerId)
        {
            ProductId = productId;
            QuestionId = questionId;
            SellerId = sellerId;
        }
    }
}

using Application.Abstractions;
using Domain.DomainEvents;
using Domain.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Events
{
    public class SellerRepliedToQuestionEmailHandler
        : INotificationHandler<SellerRepliedToQuestionDomainEvent>
    {
        private readonly IEmailService _emailSender;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;

        public SellerRepliedToQuestionEmailHandler(
            IEmailService emailSender,
            IUserRepository userRepository,
            IProductRepository productRepository)
        {
            _emailSender = emailSender;
            _userRepository = userRepository;
            _productRepository = productRepository;
        }

        public async Task Handle(
            SellerRepliedToQuestionDomainEvent notification,
            CancellationToken ct)
        {
            var product = await _productRepository
                .GetProducts()
                .Include(p => p.Comments)
                .Include(p => p.BiddingHistories)
                .FirstOrDefaultAsync(p => p.Id == notification.ProductId, ct);

            if (product == null)
                return;

            // Người đặt câu hỏi + người đã hỏi + người đấu giá
            var buyerIds =
                product.Comments
                    .Where(c => c.ParentId == null)
                    .Select(c => c.UserId)
                .Union(product.BiddingHistories.Select(b => b.BidderId))
                .Distinct()
                .ToList();
            var question = await _productRepository.GetComment()
                .FirstOrDefaultAsync(c=> c.Id ==  notification.ProductId,ct);
            if (question == null) return;
            foreach (var buyerId in buyerIds)
            {
                var buyer = await _userRepository.GetUserById(buyerId);
                if (buyer == null)
                    continue;

                await _emailSender.SendAsync(
                    buyer.Email!,
                    "Seller replied to a question",
                    $"Seller answered the question '{question.Content}' on '{product.Name}'.");
            }
        }
    }
}

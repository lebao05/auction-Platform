using Application.Abstractions;
using Domain.DomainEvents;
using Domain.Repositories;
using MediatR;

namespace Application.Product.Events
{
    public class BuyerAskedQuestionEmailHandler
        : INotificationHandler<BuyerAskedQuestionDomainEvent>
    {
        private readonly IEmailService _emailSender;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;

        public BuyerAskedQuestionEmailHandler(
            IEmailService emailSender,
            IUserRepository userRepository,
            IProductRepository productRepository)
        {
            _emailSender = emailSender;
            _userRepository = userRepository;
            _productRepository = productRepository;
        }

        public async Task Handle(
            BuyerAskedQuestionDomainEvent notification,
            CancellationToken ct)
        {
            var product = await _productRepository.GetProductAsyncById(notification.ProductId, ct);
            if (product == null) return;

            var seller = await _userRepository.GetUserById(product.SellerId);
            if (seller == null) return;

            var buyder = await _userRepository.GetUserById(notification.BuyerId);
            await _emailSender.SendAsync(
                seller!.Email!,
                "New question on your product",
                $"{buyder!.FullName} asked a question on '{product.Name}'.");
        }
    }

}

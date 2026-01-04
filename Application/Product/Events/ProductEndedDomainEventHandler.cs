using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.DomainEvents;
using Domain.Repositories;

namespace Application.Product.Events
{

    public class ProductEndedDomainEventHandler
        : IDomainEventHandler<ProductEndedDomainEvent>
    {
        private readonly IEmailService _emailSender;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;

        public ProductEndedDomainEventHandler(
            IEmailService emailSender,
            IUserRepository userRepository,
            IProductRepository productRepository)
        {
            _emailSender = emailSender;
            _userRepository = userRepository;
            _productRepository = productRepository;
        }

        public async Task Handle(ProductEndedDomainEvent notification, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetProductAsyncById(notification.ProductId,cancellationToken);
            var seller = await _userRepository.GetUserById(notification.SellerId);

            await _emailSender.SendAsync(
            seller!.Email!,
            $"Your product has ended {(notification.WinnerId.HasValue ? "" : "without winner")}",
            $"Product '{product!.Name}' has ended."
              );

            // Winner email (if any)
            if (notification.WinnerId.HasValue)
            {
                var winner = await _userRepository.GetUserById(notification.WinnerId.Value);

                await _emailSender.SendAsync(
                    winner!.Email!,
                    "You won the auction",
                    $"You won '{product.Name}'. Please proceed to payment."
                );
            }
        }
    }
}

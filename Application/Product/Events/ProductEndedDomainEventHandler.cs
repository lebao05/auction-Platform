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

        // NÊN move sang appsettings
        private const string FrontendBaseUrl = "http://localhost:5173";

        public ProductEndedDomainEventHandler(
            IEmailService emailSender,
            IUserRepository userRepository,
            IProductRepository productRepository)
        {
            _emailSender = emailSender;
            _userRepository = userRepository;
            _productRepository = productRepository;
        }

        public async Task Handle(
            ProductEndedDomainEvent notification,
            CancellationToken cancellationToken)
        {
            var product = await _productRepository
                .GetProductAsyncById(notification.ProductId, cancellationToken);

            if (product == null)
                return;

            var seller = await _userRepository.GetUserById(notification.SellerId);

            if (seller == null)
                return;

            var productLink = $"{FrontendBaseUrl}/product/{product.Id}";
            var paymentLink = $"{FrontendBaseUrl}/order/{product.Id}";

            // 1 Email cho người bán
            await _emailSender.SendAsync(
                seller.Email!,
                $"Your product has ended {(notification.WinnerId.HasValue ? "successfully" : "without a winner")}",
                BuildSellerEmail(product.Name, productLink, notification.WinnerId.HasValue)
            );

            // 2 Email cho người thắng (nếu có)
            if (notification.WinnerId.HasValue)
            {
                var winner = await _userRepository.GetUserById(notification.WinnerId.Value);

                if (winner != null)
                {
                    await _emailSender.SendAsync(
                        winner.Email!,
                        "You won the auction!",
                        BuildWinnerEmail(product.Name, productLink, paymentLink)
                    );
                }
            }
        }

        /* ---------------- EMAIL TEMPLATES ---------------- */

        private static string BuildSellerEmail(
            string productName,
            string productLink,
            bool hasWinner)
        {
            return $@"
<html>
  <body style='font-family:Arial,sans-serif'>
    <h2>Auction ended</h2>

    <p>
      Your product <strong>{productName}</strong>
      has ended <strong>{(hasWinner ? "with a winner" : "without a winner")}</strong>.
    </p>

    <p>
      <a href='{productLink}'
         style='display:inline-block;
                padding:10px 16px;
                background:#2563eb;
                color:#ffffff;
                text-decoration:none;
                border-radius:6px'>
        View product
      </a>
    </p>
  </body>
</html>";
        }

        private static string BuildWinnerEmail(
            string productName,
            string productLink,
            string paymentLink)
        {
            return $@"
<html>
  <body style='font-family:Arial,sans-serif'>
    <h2>Congratulations!</h2>

    <p>
      You won the auction for
      <strong>{productName}</strong>.
    </p>

    <p>
      Please complete your payment to finalize the order.
    </p>

    <p>
      <a href='{paymentLink}'
         style='display:inline-block;
                padding:12px 18px;
                background:#16a34a;
                color:#ffffff;
                text-decoration:none;
                border-radius:6px;
                font-weight:bold'>
        Pay now
      </a>
    </p>

    <p style='margin-top:12px'>
      <a href='{productLink}' style='color:#2563eb'>
        View product details
      </a>
    </p>
  </body>
</html>";
        }
    }
}

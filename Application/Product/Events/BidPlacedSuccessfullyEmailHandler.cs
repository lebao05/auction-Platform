using Application.Abstractions;
using Domain.DomainEvents;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Events
{
    public class BidPlacedSuccessfullyEmailHandler
        : INotificationHandler<BidPlacedSuccessfullyDomainEvent>
    {
        private readonly IEmailService _emailSender;
        private readonly IProductRepository _productRepository;

        // nên move sang config / appsettings
        private const string FrontendBaseUrl = "http://localhost:5173";

        public BidPlacedSuccessfullyEmailHandler(
            IEmailService emailSender,
            IProductRepository productRepository)
        {
            _emailSender = emailSender;
            _productRepository = productRepository;
        }

        public async Task Handle(
            BidPlacedSuccessfullyDomainEvent notification,
            CancellationToken ct)
        {
            var product = await _productRepository
                .GetProducts()
                .Include(p => p.Seller)
                .Include(p => p.Winner)
                .FirstOrDefaultAsync(p => p.Id == notification.ProductId, ct);

            if (product == null)
                return;

            var productLink = $"{FrontendBaseUrl}/product/{product.Id}";
            var priceFormatted = notification.NewPrice.ToString("N0");

            // 1 Email cho người bán
            await _emailSender.SendAsync(
                product.Seller.Email!,
                "New highest bid on your product",
                BuildSellerEmail(product.Name, priceFormatted, productLink)
            );

            // 2 Email cho người vừa ra giá (highest bidder)
            if (product.Winner != null)
            {
                await _emailSender.SendAsync(
                    product.Winner.Email!,
                    "You are the highest bidder",
                    BuildHighestBidderEmail(product.Name, priceFormatted, productLink)
                );
            }

            // 3 Email cho người giữ giá trước đó (nếu có)
            if (notification.PreviousBidderId.HasValue &&
                notification.PreviousBidderId != notification.NewBidderId)
            {
                var previousBidder = await _productRepository
                    .GetProducts()
                    .SelectMany(p => p.BiddingHistories)
                    .Where(b => b.BidderId == notification.PreviousBidderId)
                    .Select(b => b.Bidder)
                    .FirstOrDefaultAsync(ct);

                if (previousBidder != null)
                {
                    await _emailSender.SendAsync(
                        previousBidder.Email!,
                        "You have been outbid",
                        BuildOutbidEmail(product.Name, priceFormatted, productLink)
                    );
                }
            }
        }

        /* ---------------- EMAIL TEMPLATES ---------------- */

        private static string BuildSellerEmail(
            string productName,
            string price,
            string link)
        {
            return $@"
<html>
  <body style='font-family:Arial,sans-serif'>
    <h2>New Highest Bid</h2>
    <p>
      Your product <strong>{productName}</strong>
      has a new highest bid.
</p>

    <p>
      <a href='{link}'
         style='display:inline-block;
                padding:10px 16px;
                background:#2563eb;
                color:#ffffff;
                text-decoration:none;
                border-radius:6px'>
        View Product
      </a>
    </p>
  </body>
</html>";
        }

        private static string BuildHighestBidderEmail(
            string productName,
            string price,
            string link)
        {
            return $@"
<html>
  <body style='font-family:Arial,sans-serif'>
    <h2>You are leading the auction</h2>
    <p>
      You are currently the highest bidder for
      <strong>{productName}</strong>.
    </p>

    <p>
      <a href='{link}'>View product</a>
    </p>
  </body>
</html>";
        }

        private static string BuildOutbidEmail(
            string productName,
            string price,
            string link)
        {
            return $@"
<html>
  <body style='font-family:Arial,sans-serif'>
    <h2>You have been outbid</h2>
    <p>
      You have been outbid on
      <strong>{productName}</strong>.
    </p>

    <p>
      <a href='{link}'
         style='color:#2563eb;font-weight:bold'>
        Place a new bid
      </a>
    </p>
  </body>
</html>";
        }
    }
}

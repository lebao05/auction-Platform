using Application.Abstractions;
using Domain.DomainEvents;
using Domain.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Events
{
    public class SellerAddedDescriptionEmailHandler
        : INotificationHandler<SellerAddedDescriptionDomainEvent>
    {
        private readonly IEmailService _emailSender;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;

        // 👉 move to appsettings later
        private const string FrontendBaseUrl = "http://localhost:5173";

        public SellerAddedDescriptionEmailHandler(
            IEmailService emailSender,
            IProductRepository productRepository,
            IUserRepository userRepository)
        {
            _emailSender = emailSender;
            _productRepository = productRepository;
            _userRepository = userRepository;
        }

        public async Task Handle(
            SellerAddedDescriptionDomainEvent notification,
            CancellationToken ct)
        {
            var product = await _productRepository
                .GetProducts()
                .Include(p => p.Comments)
                .Include(p => p.BiddingHistories)
                .FirstOrDefaultAsync(p => p.Id == notification.ProductId, ct);

            if (product == null)
                return;

            var productLink = $"{FrontendBaseUrl}/product/{product.Id}";

            // Interested users: asked questions + bidders
            var userIds =
                product.Comments
                    .Where(c => c.ParentId == null)
                    .Select(c => c.UserId)
                .Union(product.BiddingHistories.Select(b => b.BidderId))
                .Distinct()
                .ToList();

            foreach (var userId in userIds)
            {
                var user = await _userRepository.GetUserById(userId);

                // Skip seller & invalid emails
                if (user == null ||
                    user.Id == notification.SellerId ||
                    string.IsNullOrWhiteSpace(user.Email))
                    continue;

                await _emailSender.SendAsync(
                    user.Email,
                    "Product description updated",
                    BuildDescriptionUpdatedEmail(
                        product.Name,
                        notification.Description,
                        productLink));
            }
        }

        /* ---------------- EMAIL TEMPLATE ---------------- */

        private static string BuildDescriptionUpdatedEmail(
            string productName,
            string description,
            string link)
        {
            return $@"
<html>
  <body style='font-family:Arial,sans-serif;line-height:1.6'>
    <h2>Product Update 📢</h2>

    <p>
      The seller has updated the description for
      <strong>{productName}</strong>.
    </p>

    <blockquote style='
        margin:16px 0;
        padding:12px;
        background:#f9fafb;
        border-left:4px solid #2563eb;'>
      {description}
    </blockquote>

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
    }
}

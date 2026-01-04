using Application.Abstractions;
using Domain.DomainEvents;
using Domain.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Events
{
    public class BidPlacedSuccessfullyEmailHandler
        : INotificationHandler<BidPlacedSuccessfullyDomainEvent>
    {
        private readonly IEmailService _emailSender;
        private readonly IProductRepository _productRepository;

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

            // 1️⃣ Gửi người bán
            await _emailSender.SendAsync(
                product.Seller.Email!,
                "New highest bid on your product",
                $"Your product '{product.Name}' has a new highest bid: {notification.NewPrice}.");

            // 2️⃣ Gửi người vừa ra giá
            await _emailSender.SendAsync(
                product.Winner!.Email!,
                "You are the highest bidder",
                $"You are currently the highest bidder for '{product.Name}' with price {notification.NewPrice}.");

            // 3️⃣ Gửi người giữ giá trước đó (nếu có)
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
                        $"You have been outbid on '{product.Name}'. Current price is {notification.NewPrice}.");
                }
            }
        }
    }
}

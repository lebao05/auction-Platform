using Application.Abstractions;
using Domain.DomainEvents;
using Domain.Repositories;
using MediatR;

public class BidderBlacklistedDomainEventHandler
    : INotificationHandler<BidderBlacklistedDomainEvent>
{
    private readonly IEmailService _emailSender;
    private readonly IUserRepository _userRepository;
    private readonly IProductRepository _productRepository;

    public BidderBlacklistedDomainEventHandler(
        IEmailService emailSender,
        IUserRepository userRepository,
        IProductRepository productRepository)
    {
        _emailSender = emailSender;
        _userRepository = userRepository;
        _productRepository = productRepository;
    }

    public async Task Handle(
        BidderBlacklistedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        var bidder = await _userRepository.GetUserById(notification.BidderId);
        var product = await _productRepository.GetProductAsyncById(notification.ProductId,cancellationToken);

        if (bidder == null || product == null)
            return;

        await _emailSender.SendAsync(
            bidder.Email!,
            "You have been banned from bidding",
            $"You are banned from bidding on product '{product.Name}'.");
    }
}

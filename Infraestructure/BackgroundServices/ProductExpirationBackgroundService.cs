using Application.Abstractions;
using Domain.Enums;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class ProductExpirationBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ProductExpirationBackgroundService> _logger;

    public ProductExpirationBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<ProductExpirationBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Product expiration background service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessExpiredProducts(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while processing expired products");
            }

            // 🔁 Run every 1 minute (adjust as needed)
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private async Task ProcessExpiredProducts(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();

        var productRepository = scope.ServiceProvider
            .GetRequiredService<IProductRepository>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var now = DateTime.UtcNow;
        var minuteStart = new DateTime(
            now.Year,
            now.Month,
            now.Day,
            now.Hour,
            now.Minute,
            0,
            DateTimeKind.Utc);

        var minuteEnd = minuteStart.AddMinutes(1);

        var expiredProducts = await productRepository
            .GetProducts()
            .Where(p =>
                p.EndDate >= minuteStart &&
                p.EndDate < minuteEnd &&
                p.OrderStatus == OrderStatus.WaitingForPayment)
            .ToListAsync(cancellationToken);

        if (!expiredProducts.Any())
            return;

        foreach (var product in expiredProducts)
        {
            product.EndByTime(); // raises domain event
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Processed {Count} expired products",
            expiredProducts.Count);
    }
}

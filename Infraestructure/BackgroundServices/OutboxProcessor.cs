using Infraestructure.Persistence.Contexts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Infraestructure.BackgroundServices
{
    public class OutboxProcessor : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<OutboxProcessor> _logger;

        public OutboxProcessor(IServiceScopeFactory scopeFactory, ILogger<OutboxProcessor> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("OutboxProcessor started at {Time}", DateTime.UtcNow);

            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

                var messages = await context.OutboxMessages
                    .Where(x => x.ProcessedOnUtc == null)
                    .OrderBy(x => x.OccurredOnUtc)
                    .Take(10)
                    .ToListAsync(stoppingToken);

                if (!messages.Any())
                {
                    _logger.LogDebug("No outbox messages to process at {Time}", DateTime.UtcNow);
                }

                foreach (var message in messages)
                {
                    try
                    {
                        _logger.LogInformation("Processing outbox message {MessageId} of type {MessageType}", message.Id, message.Type);

                        var eventType = Type.GetType(message.Type);
                        if (eventType == null)
                        {
                            _logger.LogWarning("Type not found for message {MessageId}: {MessageType}", message.Id, message.Type);
                            continue;
                        }

                        var domainEvent = JsonConvert.DeserializeObject(message.PayLoad, eventType);

                        if (domainEvent != null)
                        {
                            await mediator.Publish(domainEvent, stoppingToken);
                            message.ProcessedOnUtc = DateTime.UtcNow;
                            _logger.LogInformation("Successfully processed message {MessageId}", message.Id);
                        }
                        else
                        {
                            _logger.LogWarning("Failed to deserialize message {MessageId}", message.Id);
                        }
                    }
                    catch (Exception ex)
                    {
                        message.Error = ex.Message;
                        _logger.LogError(ex, "Error processing message {MessageId}", message.Id);
                    }
                }

                await context.SaveChangesAsync(stoppingToken);

                await Task.Delay(1000, stoppingToken); // wait 200ms
            }

            _logger.LogInformation("OutboxProcessor stopped at {Time}", DateTime.UtcNow);
        }
    }
}

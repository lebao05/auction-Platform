using Domain.Common;
using Domain.Entities;
using Infraestructure.Outbox;
using Infraestructure.Persistence.Configurations;
using Infrastructure.Persistence.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Infraestructure.Persistence.Contexts
{
    public class ApplicationDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<BiddingHistory> BiddingHistories { get; set; }
        public DbSet<AutomatedBidding> AutomatedBiddings { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<BlackList> Blacklists { get; set; }
        public DbSet<SellerRequest> SellerRequests { get; set; }
        public DbSet<SystemSetting> SystemSettings { get; set; }
        public DbSet<EmailLog> EmailLogs { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ConversationParticipant> ConversationParticipants { get; set; }
        public DbSet<MessageAttachment> MessageAttachments { get; set; }
        public DbSet<MessageReadStatus> MessageReadStatuses { get; set; }
        public DbSet<Watchlist> Watchlists { get; set; }
        public DbSet<OutboxMessage> OutboxMessages { get; set; }
        //public DbSet<OrderCompletion> OrderCompletions { get; set; }
        //public DbSet<OrderChatMessage> OrderChatMessages { get; set; }
        //public DbSet<OrderActivityLog> OrderActivityLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new AppUserConfiguration());
            builder.ApplyConfiguration(new ProductConfiguration());
            builder.ApplyConfiguration(new ProductImageConfiguration());
            builder.ApplyConfiguration(new CategoryConfiguration());
            builder.ApplyConfiguration(new BiddingHistoryConfiguration());
            builder.ApplyConfiguration(new AutomatedBiddingConfiguration());
            builder.ApplyConfiguration(new RatingConfiguration());
            builder.ApplyConfiguration(new CommentConfiguration());
            builder.ApplyConfiguration(new BlackListConfiguration());
            builder.ApplyConfiguration(new SystemSettingConfiguration());
            builder.ApplyConfiguration(new EmailLogConfiguration());
            builder.ApplyConfiguration(new SellerRequestConfiguration());
            builder.ApplyConfiguration(new WatchlistConfiguration());
            base.OnModelCreating(builder);
            builder.Entity<AppUser>().ToTable("AspNetUsers");
            builder.Entity<IdentityRole<Guid>>().ToTable("AspNetRoles");
            builder.Entity<IdentityUserRole<Guid>>().ToTable("AspNetUserRoles");
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("AspNetUserClaims");
            builder.Entity<IdentityUserLogin<Guid>>().ToTable("AspNetUserLogins");
            builder.Entity<IdentityRoleClaim<Guid>>().ToTable("AspNetRoleClaims");
            builder.Entity<IdentityUserToken<Guid>>().ToTable("AspNetUserTokens");
            builder.Entity<IdentityRole<Guid>>().HasData(
                new IdentityRole<Guid> { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Bidder", NormalizedName = "BIDDER" },
                new IdentityRole<Guid> { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Seller", NormalizedName = "SELLER" },
                new IdentityRole<Guid> { Id = Guid.Parse("22222222-2222-2222-3333-222222222222"), Name = "User", NormalizedName = "User" },
                new IdentityRole<Guid> { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Admin", NormalizedName = "ADMIN" }
            );
            builder.Entity<SystemSetting>().HasData(
                new SystemSetting
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    SystemKey = "NewProductTime",
                    SystemValue = 5
                },
                new SystemSetting
                {
                    Id = Guid.Parse("13333333-3333-3333-3333-333333333333"),
                    SystemKey = "ExtraRenewalTime",
                    SystemValue = 10
                },
                new SystemSetting
                {
                    Id = Guid.Parse("23333333-3333-3333-3333-333333333333"),
                    SystemKey = "RenewalTriggerTime",
                    SystemValue = 5
                }
            );
            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                }
            }

            foreach (var entry in ChangeTracker.Entries<AppUser>())
            {
                switch (entry.State)
                {
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                }
            }
 
            var domainEvents = ChangeTracker
                  .Entries<BaseEntity>()
                  .Where(e => e.Entity.DomainEvents.Any())
                  .SelectMany(e => e.Entity.DomainEvents)
                  .ToList();

            // Convert domain events into Outbox messages
            foreach (var domainEvent in domainEvents)
            {
                var type = domainEvent.GetType().AssemblyQualifiedName!;
                var payload = JsonConvert.SerializeObject(domainEvent);

                OutboxMessages.Add(new OutboxMessage
                {
                    Type = type,
                    PayLoad = payload
                });
            }

            // Clear domain events from entities
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
                entry.Entity.ClearDomainEvents();
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}

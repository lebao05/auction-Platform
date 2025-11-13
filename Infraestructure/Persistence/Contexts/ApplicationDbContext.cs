using Domain.Common;
using Domain.Entities;
using Infraestructure.Persistence.Configurations;
using Infrastructure.Persistence.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Persistence.Contexts
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
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
        public DbSet<ProductDescriptionHistory> ProductDescriptionHistories { get; set; }
        //public DbSet<OrderCompletion> OrderCompletions { get; set; }
        //public DbSet<OrderChatMessage> OrderChatMessages { get; set; }
        //public DbSet<OrderActivityLog> OrderActivityLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new UserConfiguration());
            builder.ApplyConfiguration(new ProductConfiguration());
            builder.ApplyConfiguration(new ProductImageConfiguration());
            builder.ApplyConfiguration(new ProductDescriptionHistoryConfiguration());
            builder.ApplyConfiguration(new CategoryConfiguration());
            builder.ApplyConfiguration(new BiddingHistoryConfiguration());
            builder.ApplyConfiguration(new AutomatedBiddingConfiguration());
            builder.ApplyConfiguration(new RatingConfiguration());
            builder.ApplyConfiguration(new CommentConfiguration());
            builder.ApplyConfiguration(new BlackListConfiguration());
            builder.ApplyConfiguration(new SystemSettingConfiguration());
            builder.ApplyConfiguration(new EmailLogConfiguration());
            builder.ApplyConfiguration(new SellerRequestConfiguration());
            base.OnModelCreating(builder); 
            builder.Entity<User>().ToTable("AspNetUsers");
            builder.Entity<IdentityRole<Guid>>().ToTable("AspNetRoles");
            builder.Entity<IdentityUserRole<Guid>>().ToTable("AspNetUserRoles");
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("AspNetUserClaims");
            builder.Entity<IdentityUserLogin<Guid>>().ToTable("AspNetUserLogins");
            builder.Entity<IdentityRoleClaim<Guid>>().ToTable("AspNetRoleClaims");
            builder.Entity<IdentityUserToken<Guid>>().ToTable("AspNetUserTokens");
            builder.Entity<IdentityRole<Guid>>().HasData(
                new IdentityRole<Guid> { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Bidder", NormalizedName = "BIDDER" },
                new IdentityRole<Guid> { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Seller", NormalizedName = "SELLER" },
                new IdentityRole<Guid> { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Admin", NormalizedName = "ADMIN" }
            );
            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            //foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            //{
            //    switch (entry.State)
            //    {
            //        case EntityState.Added:
            //            entry.Entity.CreatedAt = DateTime.UtcNow;
            //            break;
            //        case EntityState.Modified:
            //            entry.Entity.UpdatedAt = DateTime.UtcNow;
            //            break;
            //    }
            //}
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}

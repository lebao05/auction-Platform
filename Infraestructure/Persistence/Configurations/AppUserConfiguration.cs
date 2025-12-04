using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Persistence.Configurations
{
    public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.ToTable("AppUsers");
            builder.HasKey(u => u.Id);

            builder.Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(u => u.Email)
                .IsUnique();

            builder.Property(u => u.Address)
                .HasMaxLength(500);

            builder.HasMany(u => u.ProductsAsSeller)
                .WithOne(p => p.Seller)
                .HasForeignKey(p => p.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.BiddingHistories)
                .WithOne(b => b.Bidder)
                .HasForeignKey(b => b.BidderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.RatingsGiven)
                .WithOne(r => r.Rater)
                .HasForeignKey(r => r.RaterId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.RatingsReceived)
                .WithOne(r => r.RatedUser)
                .HasForeignKey(r => r.RatedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.SellerRequests)
                .WithOne(sr => sr.User)
                .HasForeignKey(sr => sr.UserId);

            //builder.HasMany(u => u.OrdersAsSeller)
            //    .WithOne(o => o.Seller)
            //    .HasForeignKey(o => o.SellerId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //builder.HasMany(u => u.OrdersAsBuyer)
            //    .WithOne(o => o.Buyer)
            //    .HasForeignKey(o => o.BuyerId)
            //    .OnDelete(DeleteBehavior.Restrict);
            builder.HasIndex(u => u.NormalizedEmail).IsUnique();
        }
    }
}

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class WatchlistConfiguration : IEntityTypeConfiguration<Watchlist>
    {
        public void Configure(EntityTypeBuilder<Watchlist> builder)
        {
            builder.ToTable("Watchlists");

            builder.HasKey(w => w.Id);

            builder.HasIndex(w => new { w.UserId, w.ProductId })
                   .IsUnique();

            builder.HasOne(w => w.User)
                   .WithMany(u => u.Watchlists)
                   .HasForeignKey(w => w.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Product → Watchlists
            builder.HasOne(w => w.Product)
                   .WithMany(p => p.Watchlists)
                   .HasForeignKey(w => w.ProductId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class BiddingHistoryConfiguration : IEntityTypeConfiguration<BiddingHistory>
    {
        public void Configure(EntityTypeBuilder<BiddingHistory> builder)
        {
            builder.ToTable("BiddingHistories");
            builder.HasKey(bh => bh.Id);

            builder.HasOne(bh => bh.Product)
                .WithMany(p => p.BiddingHistories)
                .HasForeignKey(bh => bh.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(bh => bh.Bidder)
                .WithMany(u => u.BiddingHistories)
                .HasForeignKey(bh => bh.BidderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class BlackListConfiguration : IEntityTypeConfiguration<BlackList>
    {
        public void Configure(EntityTypeBuilder<BlackList> builder)
        {
            builder.ToTable("BlackLists");
            builder.HasKey(b => b.Id);

            builder.HasOne(b => b.Product)
                .WithMany(p => p.Blacklists)
                .HasForeignKey(b => b.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(b => b.Seller)
                .WithMany()
                .HasForeignKey(b => b.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(b => b.Bidder)
                .WithMany()
                .HasForeignKey(b => b.BidderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

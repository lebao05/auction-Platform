using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class AutomatedBiddingConfiguration : IEntityTypeConfiguration<AutomatedBidding>
{
    public void Configure(EntityTypeBuilder<AutomatedBidding> builder)
    {
        builder.ToTable("AutomatedBiddings");
        builder.HasKey(ab => ab.Id);

        builder.HasOne(ab => ab.Product)
            .WithMany(p => p.AutomatedBiddings)
            .HasForeignKey(ab => ab.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ab => ab.Bidder)
            .WithMany()
            .HasForeignKey(ab => ab.BidderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

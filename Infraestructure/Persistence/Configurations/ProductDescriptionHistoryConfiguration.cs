using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ProductDescriptionHistoryConfiguration : IEntityTypeConfiguration<ProductDescriptionHistory>
    {
        public void Configure(EntityTypeBuilder<ProductDescriptionHistory> builder)
        {
            builder.ToTable("ProductDescriptionHistories");
            builder.HasKey(dh => dh.Id);
            builder.Property(dh => dh.Description).IsRequired();

            builder.HasOne(dh => dh.Product)
                .WithMany(p => p.DescriptionHistories)
                .HasForeignKey(dh => dh.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

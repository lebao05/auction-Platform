using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class SellerRequestConfiguration : IEntityTypeConfiguration<SellerRequest>
    {
        public void Configure(EntityTypeBuilder<SellerRequest> builder)
        {
            builder.ToTable("SellerRequests");
            builder.HasKey(sr => sr.Id);

            builder.Property(sr => sr.Status).IsRequired();
            builder.Property(sr => sr.CreatedAt).IsRequired();

            builder.HasOne(sr => sr.User)
                .WithOne(u => u.SellerRequest)
                .HasForeignKey<SellerRequest>(sr => sr.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

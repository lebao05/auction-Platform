using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class AutomatedBiddingConfiguration : IEntityTypeConfiguration<AutomatedBidding>
    {
        public void Configure(EntityTypeBuilder<AutomatedBidding> builder)
        {
            builder.ToTable("AutomatedBiddings");
            builder.HasKey(ab => ab.Id);
        }
    }
}

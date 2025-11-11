using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class RatingConfiguration : IEntityTypeConfiguration<Rating>
    {
        public void Configure(EntityTypeBuilder<Rating> builder)
        {
            builder.ToTable("Ratings");
            builder.HasKey(r => r.Id);

            builder.Property(r => r.RatingType).IsRequired();
            builder.Property(r => r.Comment).HasMaxLength(500);

            builder.HasOne(r => r.Rater)
                .WithMany(u => u.RatingsGiven)
                .HasForeignKey(r => r.RaterId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.RatedUser)
                .WithMany(u => u.RatingsReceived)
                .HasForeignKey(r => r.RatedUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

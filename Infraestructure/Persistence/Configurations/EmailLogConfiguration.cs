using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class EmailLogConfiguration : IEntityTypeConfiguration<EmailLog>
    {
        public void Configure(EntityTypeBuilder<EmailLog> builder)
        {
            builder.ToTable("EmailLogs");
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Description).IsRequired().HasMaxLength(1000);
            builder.Property(e => e.Status).IsRequired().HasMaxLength(50);

            builder.HasOne(e => e.Receiver)
                .WithMany()
                .HasForeignKey(e => e.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

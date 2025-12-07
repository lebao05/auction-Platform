using Infraestructure.Outbox;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Persistence.Configurations
{
    public sealed class OutboxMessageConfiguration : IEntityTypeConfiguration<OutboxMessage>
    {
        public void Configure(EntityTypeBuilder<OutboxMessage> builder)
        {
            // Table name
            builder.ToTable("OutboxMessages");

            // Primary key
            builder.HasKey(x => x.Id);

            // Properties
            builder.Property(x => x.Type)
                   .IsRequired()
                   .HasMaxLength(250);

            builder.Property(x => x.PayLoad)
                   .IsRequired();

            builder.Property(x => x.Error)
                   .HasMaxLength(2000);

            // Index for faster querying of unprocessed messages
            builder.HasIndex(x => x.ProcessedOnUtc);
        }
    }
}

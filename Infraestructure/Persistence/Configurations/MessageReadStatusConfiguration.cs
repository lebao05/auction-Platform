using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Persistence.Configurations
{
    public class MessageReadStatusConfiguration : IEntityTypeConfiguration<MessageReadStatus>
    {
        public void Configure(EntityTypeBuilder<MessageReadStatus> builder)
        {
            builder.ToTable("MessageReadStatuses");

            builder.HasKey(rs => rs.Id);

            builder.Property(rs => rs.ReadAt)
                .IsRequired(false);


            builder.HasOne(rs => rs.Message)
                .WithMany(m => m.ReadStatuses)
                .HasForeignKey(rs => rs.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(rs => rs.User)
                .WithMany()
                .HasForeignKey(rs => rs.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

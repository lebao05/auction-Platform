using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Persistence.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.ToTable("Messages");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.MessageType)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(m => m.Content)
                .HasMaxLength(4000);   

            builder.Property(m => m.IsDeleted)
                .HasDefaultValue(false);

            builder.HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(m => m.ReadStatuses)
                .WithOne(rs => rs.Message)
                .HasForeignKey(rs => rs.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(m => m.Attachments)
                .WithOne(a => a.Message)
                .HasForeignKey(a => a.MessageId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infraestructure.Persistence.Configurations
{
    public class MessageAttachmentConfiguration : IEntityTypeConfiguration<MessageAttachment>
    {
        public void Configure(EntityTypeBuilder<MessageAttachment> builder)
        {
            builder.ToTable("MessageAttachments");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.FileUrl)
                .IsRequired()
                .HasMaxLength(2000); 

            builder.Property(a => a.FileName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(a => a.FileSize)
                .IsRequired();

            builder.Property(a => a.FileType)
                   .HasConversion<int>()
                   .IsRequired()
                   .HasMaxLength(20);

            builder.HasOne(a => a.Message)
                .WithOne(m => m.Attachments)
                .HasForeignKey<MessageAttachment>(a => a.MessageId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

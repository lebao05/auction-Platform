using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
    {
        public void Configure(EntityTypeBuilder<SystemSetting> builder)
        {
            builder.ToTable("SystemSettings");
            builder.HasKey(s => s.Id);

            builder.Property(s => s.SystemKey).IsRequired().HasMaxLength(100);
            builder.Property(s => s.SystemValue).IsRequired().HasMaxLength(500);
        }
    }
}

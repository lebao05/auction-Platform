using Domain.Common;
namespace Domain.Entities
{
    public class SystemSetting : BaseEntity
    {
        public string SystemKey { get; set; } = string.Empty;
        public string SystemValue { get; set; } = string.Empty;
    }
}

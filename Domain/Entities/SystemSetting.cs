using Domain.Common;

public class SystemSetting : BaseEntity
{
    public string SystemKey { get; set; } = null!;
    public int SystemValue { get; set; }

    public SystemSetting(string systemKey, int systemValue, Guid id) : base(id)
    {
        SystemKey = systemKey;
        SystemValue = systemValue;
    }
    public SystemSetting() { }
}

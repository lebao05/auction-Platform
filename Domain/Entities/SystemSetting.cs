using Domain.Common;

    public class SystemSetting : BaseEntity
{
    public string SystemKey { get; private set; } = null!;
    public int SystemValue { get; private set; }

    public SystemSetting(string systemKey, int systemValue, Guid id) : base(id)
    {
        SystemKey = systemKey;
        SystemValue = systemValue;
    }

    public void UpdateSystemValue(int newValue)
    {
        SystemValue = newValue;
    }

    public SystemSetting() { }
}

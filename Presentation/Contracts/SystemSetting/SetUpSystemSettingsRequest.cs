namespace Presentation.Contracts.SystemSetting
{
    public class SetUpSystemSettingsRequest
    {
        public string systemKey { get; set; } = null!;

        public int systemValue { get; set; }
    }
}

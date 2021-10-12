namespace ServiceDirectory.Common
{
    public class APIValidatorSettings
    {
        public bool FirstPageOnly { get; set; } = false;
        public bool SamplePages { get; set; } = false;
        public bool RandomServiceOnly { get; set; } = false;
        public int RequestRate { get; set; } = 100;
    }
}

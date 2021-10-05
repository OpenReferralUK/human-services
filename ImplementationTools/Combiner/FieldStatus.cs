namespace Combiner
{
    internal class FieldStatus
    {
        public FieldStatus(bool isVisible, bool isNullByDefault)
        {
            IsVisible = isVisible;
            IsNullByDefault = isNullByDefault;
        }

        public bool IsVisible { get; }
        public bool IsNullByDefault { get; }
    }
}

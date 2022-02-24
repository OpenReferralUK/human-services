namespace Combiner
{
    internal class FieldStatus
    {
        public FieldStatus(bool isVisible, bool isNullByDefault)
        {
            IsVisible = isVisible;
            IsNullByDefault = isNullByDefault;
        }

        public bool IsVisible { get; private set; }
        public bool IsNullByDefault { get; private set; }
    }
}

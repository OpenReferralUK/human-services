namespace ServiceDirectory.Common.Results
{
    public class ResourceCount
    {
        public string Name { get; private set; }
        public int Count { get; private set; }

        public ResourceCount(string name, int count)
        {
            Name = name;
            Count = count;
        }
    }
}

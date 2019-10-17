namespace ServiceLoader
{
    public class Taxonomy
    {
        public Taxonomy(string id, string name, string vocabulary)
        {
            Id = id;
            Name = name;
            Vocabulary = vocabulary;
        }

        public string Id { get; }
        public string Name { get; }
        public string Vocabulary { get; }
    }
}

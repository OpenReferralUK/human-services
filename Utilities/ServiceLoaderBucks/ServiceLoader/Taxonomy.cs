namespace ServiceLoader
{
    public class Taxonomy
    {
        public Taxonomy(string id, string name, string vocabulary, bool isEligibility)
        {
            Id = id;
            Name = name;
            Vocabulary = vocabulary;
            IsEligibility = isEligibility;
        }

        public string Id { get; }
        public string Name { get; }
        public string Vocabulary { get; }
        public bool IsEligibility { get; }

        public string EligibilityId { get { return IsEligibility ? Id : null; } }
    }
}

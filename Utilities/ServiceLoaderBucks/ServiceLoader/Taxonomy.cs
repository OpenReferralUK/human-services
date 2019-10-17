﻿namespace ServiceLoader
{
    public class Taxonomy
    {
        public Taxonomy(string id, string name, string vocabulary, bool isEligibility = false, string parentId = null)
        {
            Id = id;
            Name = name;
            Vocabulary = vocabulary;
            IsEligibility = isEligibility;
            ParentId = parentId;
        }

        public string Id { get; }
        public string Name { get; }
        public string Vocabulary { get; }
        public bool IsEligibility { get; }
        public string ParentId { get; }

        public string EligibilityId { get { return IsEligibility ? Id : null; } }
    }
}

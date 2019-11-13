using System;

namespace ServiceLoader
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

        private readonly string _eligibilityId = Guid.NewGuid().ToString();
        public string EligibilityId { get { return IsEligibility ? _eligibilityId : null; } }

        public static readonly Taxonomy OpenEligibilityAgeGroup = new Taxonomy("OpenEligibility:20002", "Age Group", "OpenEligibility", true);
        public static readonly Taxonomy OpenEligibilityDisability = new Taxonomy("OpenEligibility:20017", "Disability", "OpenEligibility", true);
        public static readonly Taxonomy OpenEligibilityChildren = new Taxonomy("OpenEligibility:20005", "Children", "OpenEligibility", true, OpenEligibilityAgeGroup.Id);
        public static readonly Taxonomy OpenEligibilityTeens = new Taxonomy("OpenEligibility:20004", "Teens", "OpenEligibility", true, OpenEligibilityAgeGroup.Id);
        public static readonly Taxonomy OpenEligibilityAdults = new Taxonomy("OpenEligibility:20003", "Adults", "OpenEligibility", true, OpenEligibilityAgeGroup.Id);
        public static readonly Taxonomy OpenEligibilitySeniors = new Taxonomy("OpenEligibility:20006", "Seniors", "OpenEligibility", true, OpenEligibilityAgeGroup.Id);
        public static readonly Taxonomy OpenEligibilityDevelopmentDisability = new Taxonomy("OpenEligibility:20019", "Developmental Disability", "OpenEligibility", true, OpenEligibilityDisability.Id);
        public static readonly Taxonomy OpenEligibilityMentalIllness = new Taxonomy("OpenEligibility:20025", "Mental Illness", "OpenEligibility", true, OpenEligibilityDisability.Id);
        public static readonly Taxonomy OpenEligibilityHearingImpairment = new Taxonomy("OpenEligibility:20023", "Hearing Impairment", "OpenEligibility", true, OpenEligibilityDisability.Id);
        public static readonly Taxonomy OpenEligibilityVisualImpairment = new Taxonomy("OpenEligibility:20024", "Visual Impairment", "OpenEligibility", true, OpenEligibilityDisability.Id);
        public static readonly Taxonomy OpenEligibilityLearningDisability = new Taxonomy("OpenEligibility:20018", "Learning Disability", "OpenEligibility", true, OpenEligibilityDisability.Id);
        public static readonly Taxonomy OpenEligibilityLimitedMobility = new Taxonomy("OpenEligibility:20022", "Limited Mobility", "OpenEligibility", true, OpenEligibilityDisability.Id);
        public static readonly Taxonomy OpenEligibilityPhysicalDisability = new Taxonomy("OpenEligibility:20020", "Physical Disability", "OpenEligibility", true, OpenEligibilityDisability.Id);
    }
}

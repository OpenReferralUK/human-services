using System.Collections.Generic;
using ServiceLoader.JsonMappingObjects;

namespace ServiceLoader
{
    internal static class TaxonomyBuilder
    {
        //these two are const as they are used as Id and parentId so this avoids duplicating hard coded values
        //Didn't bother with the other ids as they're only used in one place
        private const string OpenEligibilityAgeGroupId = "OpenEligibility:20002";
        private const string OpenEligibilityDisabilityId = "OpenEligibility:20017";

        //Can't use statics here as each instance needs a different EligibilityId, so changed to methods to get an instance
        public static Taxonomy GetOpenEligibilityAgeGroup() => new Taxonomy(OpenEligibilityAgeGroupId, "Age Group", "OpenEligibility", true);
        public static Taxonomy GetOpenEligibilityDisability() => new Taxonomy(OpenEligibilityDisabilityId, "Disability", "OpenEligibility", true);
        public static Taxonomy GetOpenEligibilityChildren() => new Taxonomy("OpenEligibility:20005", "Children", "OpenEligibility", true, OpenEligibilityAgeGroupId);
        public static Taxonomy GetOpenEligibilityTeens() => new Taxonomy("OpenEligibility:20004", "Teens", "OpenEligibility", true, OpenEligibilityAgeGroupId);
        public static Taxonomy GetOpenEligibilityAdults() => new Taxonomy("OpenEligibility:20003", "Adults", "OpenEligibility", true, OpenEligibilityAgeGroupId);
        public static Taxonomy GetOpenEligibilitySeniors() => new Taxonomy("OpenEligibility:20006", "Seniors", "OpenEligibility", true, OpenEligibilityAgeGroupId);
        public static Taxonomy GetOpenEligibilityDevelopmentDisability() => new Taxonomy("OpenEligibility:20019", "Developmental Disability", "OpenEligibility", true, OpenEligibilityDisabilityId);
        public static Taxonomy GetOpenEligibilityMentalIllness() => new Taxonomy("OpenEligibility:20025", "Mental Illness", "OpenEligibility", true, OpenEligibilityDisabilityId);
        public static Taxonomy GetOpenEligibilityHearingImpairment() => new Taxonomy("OpenEligibility:20023", "Hearing Impairment", "OpenEligibility", true, OpenEligibilityDisabilityId);
        public static Taxonomy GetOpenEligibilityVisualImpairment() => new Taxonomy("OpenEligibility:20024", "Visual Impairment", "OpenEligibility", true, OpenEligibilityDisabilityId);
        public static Taxonomy GetOpenEligibilityLearningDisability() => new Taxonomy("OpenEligibility:20018", "Learning Disability", "OpenEligibility", true, OpenEligibilityDisabilityId);
        public static Taxonomy GetOpenEligibilityLimitedMobility() => new Taxonomy("OpenEligibility:20022", "Limited Mobility", "OpenEligibility", true, OpenEligibilityDisabilityId);
        public static Taxonomy GetOpenEligibilityPhysicalDisability() => new Taxonomy("OpenEligibility:20020", "Physical Disability", "OpenEligibility", true, OpenEligibilityDisabilityId);

        public static IEnumerable<Taxonomy> Build(Result result)
        {
            if (!string.IsNullOrEmpty(result.Category)) yield return new Taxonomy($"category:{result.Category}", result.Category, "Bucks:category");
            foreach (var keyword in result.Keywords)
            {
                yield return new Taxonomy($"keyword:{keyword}", keyword, "Bucks:keyword");
            }

            foreach (var accessibility in result.Accessibilities)
            {
                yield return new Taxonomy($"accessibility:{accessibility}", accessibility, "Bucks:accessibility");
            }

            foreach (var ageGroup in result.AgeGroups)
            {
                yield return new Taxonomy($"age-group:{ageGroup}", ageGroup, "Bucks:age-group");
                switch (ageGroup.ToLowerInvariant())
                {
                    case "young people":
                        yield return GetOpenEligibilityChildren();
                        break;
                    case "young adults":
                        yield return GetOpenEligibilityTeens();
                        break;
                    case "older adults":
                        yield return GetOpenEligibilityAdults();
                        yield return GetOpenEligibilitySeniors();
                        break;
                }
            }

            foreach (var suitability in result.Suitabilities)
            {
                yield return new Taxonomy($"suitability:{suitability}", suitability, "Bucks:suitability");
                switch (suitability.ToLowerInvariant())
                {
                    case "autism":
                        yield return GetOpenEligibilityDevelopmentDisability();
                        break;
                    case "dementia":
                    case "mental health":
                    case "mental health/acquired brain injury":
                        yield return GetOpenEligibilityMentalIllness();
                        break;
                    case "hearing or visual impairment":
                    case "visual and/or hearing impediment":
                        yield return GetOpenEligibilityHearingImpairment();
                        yield return GetOpenEligibilityVisualImpairment();
                        break;
                    case "learning difficulties":
                    case "learning disability":
                        yield return GetOpenEligibilityLearningDisability();
                        break;
                    case "physical difficulty":
                        yield return GetOpenEligibilityLimitedMobility();
                        break;
                    case "physical disability":
                        yield return GetOpenEligibilityPhysicalDisability();
                        break;
                }
            }
        }
    }
}

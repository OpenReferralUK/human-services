using System.Collections.Generic;
using ServiceLoader.JsonMappingObjects;

namespace ServiceLoader
{
    internal static class TaxonomyBuilder
    {
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
                        yield return Taxonomy.OpenEligibilityChildren;
                        break;
                    case "young adults":
                        yield return Taxonomy.OpenEligibilityTeens;
                        break;
                    case "older adults":
                        yield return Taxonomy.OpenEligibilityAdults;
                        yield return Taxonomy.OpenEligibilitySeniors;
                        break;
                }
            }

            foreach (var suitability in result.Suitabilities)
            {
                yield return new Taxonomy($"suitability:{suitability}", suitability, "Bucks:suitability");
                switch (suitability.ToLowerInvariant())
                {
                    case "autism":
                        yield return Taxonomy.OpenEligibilityDevelopmentDisability;
                        break;
                    case "dementia":
                    case "mental health":
                    case "mental health/acquired brain injury":
                        yield return Taxonomy.OpenEligibilityMentalIllness;
                        break;
                    case "hearing or visual impairment":
                    case "visual and/or hearing impediment":
                        yield return Taxonomy.OpenEligibilityHearingImpairment;
                        yield return Taxonomy.OpenEligibilityVisualImpairment;
                        break;
                    case "learning difficulties":
                    case "learning disability":
                        yield return Taxonomy.OpenEligibilityLearningDisability;
                        break;
                    case "physical difficulty":
                        yield return Taxonomy.OpenEligibilityLimitedMobility;
                        break;
                    case "physical disability":
                        yield return Taxonomy.OpenEligibilityPhysicalDisability;
                        break;
                }
            }
        }
    }
}

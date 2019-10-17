using System.Collections.Generic;
using ServiceLoader.JsonMappingObjects;

namespace ServiceLoader
{
    internal static class TaxonomyBuilder
    {
        public static IEnumerable<Taxonomy> Build(Result result)
        {
            if (!string.IsNullOrEmpty(result.Category)) yield return new Taxonomy($"category:{result.Category}", result.Category, "Bucks:category", false);
            foreach (var keyword in result.Keywords)
            {
                yield return new Taxonomy($"keyword:{keyword}", keyword, "Bucks:keyword", false);
            }

            foreach (var accessibility in result.Accessibilities)
            {
                yield return new Taxonomy($"accessibility:{accessibility}", accessibility, "Bucks:accessibility", false);
            }

            foreach (var ageGroup in result.AgeGroups)
            {
                yield return new Taxonomy($"age-group:{ageGroup}", ageGroup, "Bucks:age-group", false);
                switch (ageGroup.ToLowerInvariant())
                {
                    case "young people":
                        yield return new Taxonomy("OpenEligibility:20005", "Children", "OpenEligibility", true);
                        break;
                    case "young adults":
                        yield return new Taxonomy("OpenEligibility:20004", "Teens", "OpenEligibility", true);
                        break;
                    case "older adults":
                        yield return new Taxonomy("OpenEligibility:20003", "Adults", "OpenEligibility", true);
                        yield return new Taxonomy("OpenEligibility:20006", "Seniors", "OpenEligibility", true);
                        break;
                }
            }

            foreach (var suitability in result.Suitabilities)
            {
                yield return new Taxonomy($"suitability:{suitability}", suitability, "Bucks:suitability", false);
                switch (suitability.ToLowerInvariant())
                {
                    case "autism":
                        yield return new Taxonomy("OpenEligibility:20019", "Developmental Disability", "OpenEligibility", true);
                        break;
                    case "dementia":
                    case "mental health":
                    case "mental health/acquired brain injury":
                        yield return new Taxonomy("OpenEligibility:20025", "Mental Illness", "OpenEligibility", true);
                        break;
                    case "hearing or visual impairment":
                    case "visual and/or hearing impediment":
                        yield return new Taxonomy("OpenEligibility:20023", "Hearing Impairment", "OpenEligibility", true);
                        yield return new Taxonomy("OpenEligibility:20024", "Visual Impairment", "OpenEligibility", true);
                        break;
                    case "learning difficulties":
                    case "learning disability":
                        yield return new Taxonomy("OpenEligibility:20018", "Learning Disability", "OpenEligibility", true);
                        break;
                    case "physical difficulty":
                        yield return new Taxonomy("OpenEligibility:20022", "Limited Mobility", "OpenEligibility", true);
                        break;
                    case "physical disability":
                        yield return new Taxonomy("OpenEligibility:20020", "Physical Disability", "OpenEligibility", true);
                        break;
                }
            }
        }
    }
}

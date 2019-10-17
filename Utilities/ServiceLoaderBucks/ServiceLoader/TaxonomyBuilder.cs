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
                        yield return new Taxonomy("OpenEligibility:20005:children", "Children", "OpenEligibility:age-group");
                        break;
                    case "young adults":
                        yield return new Taxonomy("OpenEligibility:20004:teens", "Teens", "OpenEligibility:age-group");
                        break;
                    case "older adults":
                        yield return new Taxonomy("OpenEligibility:20003:adults", "Adults", "OpenEligibility:age-group");
                        yield return new Taxonomy("OpenEligibility:20006:seniors", "Seniors", "OpenEligibility:age-group");
                        break;
                }
            }

            foreach (var suitability in result.Suitabilities)
            {
                yield return new Taxonomy($"suitability:{suitability}", suitability, "Bucks:suitability");
                switch (suitability.ToLowerInvariant())
                {
                    case "autism":
                        yield return new Taxonomy("OpenEligibility:20019:developmental-disability", "Developmental Disability", "OpenEligibility:disability");
                        break;
                    case "dementia":
                    case "mental health":
                    case "mental health/acquired brain injury":
                        yield return new Taxonomy("OpenEligibility:20025:mental-illness", "Mental Illness", "OpenEligibility:disability");
                        break;
                    case "hearing or visual impairment":
                    case "visual and/or hearing impediment":
                        yield return new Taxonomy("OpenEligibility:20023:hearing-impairment", "Hearing Impairment", "OpenEligibility:disability");
                        yield return new Taxonomy("OpenEligibility:20024:visual-impairment", "Visual Impairment", "OpenEligibility:disability");
                        break;
                    case "learning difficulties":
                    case "learning disability":
                        yield return new Taxonomy("OpenEligibility:20018:learning-disability", "Learning Disability", "OpenEligibility:disability");
                        break;
                    case "physical difficulty":
                        yield return new Taxonomy("OpenEligibility:20022:limited-mobility", "Limited Mobility", "OpenEligibility:disability");
                        break;
                    case "physical disability":
                        yield return new Taxonomy("OpenEligibility:20020:physical-disability", "Physical Disability", "OpenEligibility:disability");
                        break;
                }
            }
        }
    }
}

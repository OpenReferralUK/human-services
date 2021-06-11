using ServiceDirectory.Common;
using ServiceDirectory.Common.FeatureTests;
using ServiceDirectory.Common.Validation;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace Oruk.MultiValidation.Data
{
    public class FeedCheck
    {
        public async Task<Feed> Check(Feed feed)
        {
            var startTime = DateTime.UtcNow;
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            Console.WriteLine($"checking: {feed.Url}; started at: {startTime.ToString("yyyy-MM-ddTHH:mm:ss")}");

            var result = await APIValidator.Validate(feed.Url, new APIValidatorSettings { FirstPageOnly = false, RandomServiceOnly = false });

            stopwatch.Stop();

            var newFeed = new Feed
            {
                Url = feed.Url,
                Label = feed.Label,
                Summary = feed.Summary,
                OrganisationLabel = feed.OrganisationLabel,
                OrganisationUrl = feed.OrganisationUrl,
                DeveloperLabel = feed.DeveloperLabel,
                DeveloperUrl = feed.DeveloperUrl,
                ServicePathOverride = feed.ServicePathOverride,

                LastCheck = startTime,
                CheckIsRunning = false,
                TimeTaken = stopwatch.ElapsedMilliseconds,

                IsUp = result.IsUp,

                IsServicesValid = result.HasPagination && result.HasPaginationMetaData,
                ServicesMessage = result.ApiIssuesLevel1 == null || !result.ApiIssuesLevel1.Any() ? null : string.Join("\n", result.ApiIssuesLevel1),

                IsServiceExampleValid = result.IsServiceFound,
                ServiceExampleIdentifier = result.RandomServiceIdentifier,
                ServiceExampleMessage = result.ApiIssuesLevel2 == null || !result.ApiIssuesLevel2.Any() ? null : string.Join("\n", result.ApiIssuesLevel2),

                IsSearchEnabled = result.Level2Results != null && result.Level2Results.Any(t => t.Success),
                SearchEnabledMessage = GetSearchResultJson(result.Level2Results),
            };

            Console.WriteLine($"done: {feed.Url}; took: {stopwatch.ElapsedMilliseconds.ToString("#,###")}ms");

            return newFeed;
        }

        public TestResult GetTestByType(List<TestResult> results, string name)
        {
            return results.FirstOrDefault(r => r.Test.Name == name) ?? new TestResult { Success = false, ErrorMessage = $"Could not run {name} test due to lack of data." };
        }

        public string GetSearchResultJson(List<TestResult> results)
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(GetSearchResult(results));
        }

        public object GetSearchResult(List<TestResult> results)
        {
            var text = GetTestByType(results, TextTest.TestName);
            var age = GetTestByType(results, AgeTest.TestName);
            var postcode = GetTestByType(results, PostCodeTest.TestName);
            var taxonomy = GetTestByType(results, TaxonomyTest.TestName);
            var regularSchedule = GetTestByType(results, RegularScheduleTest.TestName);

            var tests = new List<TestResult> { text, age, postcode, taxonomy, regularSchedule };

            return new
            {
                total = tests.Count,
                passed = tests.Count(s => s != null && s.Success),
                messages = tests.Where(s => !s.Success).Select(s => s.ErrorMessage),

                all = new
                {
                    total = results.Count,
                    passed = results.Count(s => s != null && s.Success),
                    messages = results.Where(s => !s.Success).Select(s => s.ErrorMessage),
                }
            };
        }

        public Dictionary<string, object> GetSearchDictionary(List<TestResult> results)
        {
            return results.ToDictionary(r => r.Test.Name, r => (object)new { success = r.Success, message = r.ErrorMessage });
        }
    }
}

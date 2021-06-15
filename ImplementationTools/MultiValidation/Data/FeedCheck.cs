using ServiceDirectory.Common;
using ServiceDirectory.Common.FeatureTests;
using ServiceDirectory.Common.Results;
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
                SchemaType = feed.SchemaType,

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

                Filters = feed.Filters,
            };

            Console.WriteLine($"done: {feed.Url}; took: {stopwatch.ElapsedMilliseconds.ToString("#,###")}ms");

            return newFeed;
        }

        public TestResult GetTestByType(List<TestResult> results, string name)
        {
            return results.FirstOrDefault(r => r.TestName == name) ?? new TestResult { NoTestName = name, Success = false, ErrorMessage = $"Could not run {name} test due to lack of data." };
        }

        public string GetSearchResultJson(List<TestResult> results)
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(GetSearchResult(results));
        }

        public List<BasicTestResult> GetSearchResult(List<TestResult> testResults)
        {
            var text = GetTestByType(testResults, TextTest.TestName);
            var age = GetTestByType(testResults, AgeTest.TestName);
            var postcode = GetTestByType(testResults, PostCodeTest.TestName);
            var taxonomy = GetTestByType(testResults, TaxonomyTest.TestName);
            var regularSchedule = GetTestByType(testResults, RegularScheduleTest.TestName);

            var results = new List<TestResult> { text, age, postcode, taxonomy, regularSchedule };
            var testNames = results.Select(r => r.TestName).ToList();
            results.AddRange(testResults.Where(t => !testNames.Contains(t.TestName)));

            return results.Select(r => new BasicTestResult { TestName = r.TestName, Success = r.Success, ErrorMessage = r.ErrorMessage }).ToList();
        }

        public Dictionary<string, object> GetSearchDictionary(List<TestResult> results)
        {
            return results.ToDictionary(r => r.TestName, r => (object)new { success = r.Success, message = r.ErrorMessage });
        }
    }
}

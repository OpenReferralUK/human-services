using ServiceDirectory.Common;
using ServiceDirectory.Common.Validation;
using System;
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

            Console.WriteLine($"checking: {feed.Url}");
            Console.WriteLine($"started at: {startTime.ToString("yyyy-MM-ddTHH:mm:ss")}");

            var result = await APIValidator.Validate(feed.Url, new APIValidatorSettings { FirstPageOnly = true, RandomServiceOnly = true });

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

                IsSearchEnabled = result.Level2Pass,
                SearchEnabledMessage = result.ApiIssuesLevel2 == null || !result.ApiIssuesLevel2.Any() ? null : string.Join("\n", result.ApiIssuesLevel2),
            };

            Console.WriteLine($"done");
            Console.WriteLine($"took: {stopwatch.ElapsedMilliseconds.ToString("#,###")}ms");

            return newFeed;
        }
    }
}

using Oruk.MultiValidation.Data;
using ServiceDirectory.Common.Validation;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace Oruk.MultiValidation
{
    class Program
    {
        private static string ConnectionStringName { get => "oruk_validation"; }

        private static string ConnectionString { get => ConfigurationManager.ConnectionStrings[ConnectionStringName].ConnectionString; }

        static void Main(string[] args)
        {
            if (args.FirstOrDefault() == "oldest")
            {
                ValidateOldest().GetAwaiter().GetResult();
            }
            else if (args.FirstOrDefault() == "failed")
            {
                ValidateFailed().GetAwaiter().GetResult();
            }
            else if (args.FirstOrDefault() == "all")
            {
                ValidateAll().GetAwaiter().GetResult();
            }
            else if (args.Length > 0)
            {
                ValidateSingle(args.FirstOrDefault()).GetAwaiter().GetResult();
            }
            else
            {
                ValidateAll().GetAwaiter().GetResult();
            }

            Console.WriteLine("done");
        }

        static async Task<Feed> ValidateFeed(Feed feed)
        {
            var db = new Db(ConnectionString);

            var runningFeed = Feed.CreateRunning(feed);

            db.UpsertFeed(runningFeed);

            var newFeed = await new FeedCheck().Check(feed);

            db.UpsertFeed(newFeed);

            return newFeed;
        }

        static async Task<Feed> ValidateOldest()
        {
            var feed = new Db(ConnectionString).GetOldestFeed();

            return await ValidateFeed(feed);
        }

        static Task<Feed[]> ValidateFailed()
        {
            var feeds = new Db(ConnectionString).GetFeeds().Where(f => !f.CheckIsRunning && !f.IsCompleteSuccess).ToList();
            return ValidateFeeds(feeds);
        }

        static Task<Feed[]> ValidateAll()
        {
            var feeds = new Db(ConnectionString).GetFeeds();
            return ValidateFeeds(feeds);
        }

        static Task<Feed[]> ValidateFeeds(List<Feed> feeds)
        {
            var newFeeds = new List<Task<Feed>>();

            foreach (var feed in feeds)
            {
                var newFeed = ValidateFeed(feed);
                newFeeds.Add(newFeed);
            }

            return Task.WhenAll(newFeeds.ToArray());
        }

        static async Task<Feed> ValidateSingle(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                Console.WriteLine("url must be the first parameter.");
                return null;
            }

            var feed = new Db(ConnectionString).GetFeed(url);

            if (feed == null)
            {
                Console.WriteLine($"No feed found with the root url {url}.");
                return null;
            }

            return await ValidateFeed(feed);
        }
    }
}

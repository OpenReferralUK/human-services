using Oruk.MultiValidation.Data;
using ServiceDirectory.Common.Validation;
using System;
using System.Configuration;

namespace Oruk.MultiValidation
{
    class Program
    {
        private static string ConnectionStringName { get => "oruk_validation"; }

        private static string ConnectionString { get => ConfigurationManager.ConnectionStrings[ConnectionStringName].ConnectionString; }

        static void Main(string[] args)
        {
            var feed = new Db(ConnectionString).GetOldestFeed();

            ValidateFeed(feed);

            //feeds.ForEach(feed => Console.WriteLine(feed.Label));

            Console.WriteLine("done");
        }

        static void ValidateFeed(Feed feed)
        {
            var db = new Db(ConnectionString);

            var runningFeed = Feed.CreateRunning(feed);

            db.UpsertFeed(runningFeed);

            var newFeed = new FeedCheck().Check(feed).GetAwaiter().GetResult();

            db.UpsertFeed(newFeed);
        }
    }
}

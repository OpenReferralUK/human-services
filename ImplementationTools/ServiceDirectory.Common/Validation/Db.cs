using MySql.Data.MySqlClient;
using ServiceDirectory.Common.Results;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ServiceDirectory.Common.Validation
{
    public class Db
    {
        private string ConnectionString { get; set; }

        public Db(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        public T GetItem<T>(Func<IDataReader, T> convertRow, string sql, params KeyValuePair<string, object>[] parameters)
        {
            var results = GetList(convertRow, sql, parameters);
            return results.FirstOrDefault();
        }

        public List<T> GetList<T>(Func<IDataReader, T> convertRow, string sql, params KeyValuePair<string, object>[] parameters)
        {
            try
            {
                using (var connection = new MySqlConnection(ConnectionString))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {

                        command.CommandType = CommandType.Text;
                        command.CommandText = sql;

                        AddParameters(command, parameters);

                        var results = new List<T>();

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                try
                                {
                                    var item = convertRow(reader);
                                    results.Add(item);
                                }
                                finally
                                {
                                }
                            }
                        }

                        return results;
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"ERROR: ${e.Message}");
                return new List<T>();
            }
        }

        public int Execute(string sql, params KeyValuePair<string, object>[] parameters)
        {
            try
            {
                using (var connection = new MySqlConnection(ConnectionString))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandType = CommandType.Text;
                        command.CommandText = sql;

                        AddParameters(command, parameters);

                        return command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"ERROR: ${e.Message}");
                return -2;
            }
        }

        private void AddParameters(MySqlCommand command, params KeyValuePair<string, object>[] parameters)
        {
            if (parameters == null)
                return;

            foreach (var parameter in parameters)
            {
                command.Parameters.AddWithValue($"@{parameter.Key}", parameter.Value);
            }
        }

        private static FeedFilter BuildFeedFilter(IDataReader reader)
        {
            return new FeedFilter
            {
                Url = Convert.ToString(reader["url"]),
                Filter = Convert.ToString(reader["filter"])
            };
        }

        private static Feed BuildFeed(IDataReader reader)
        {
            var searchResults = GetSearchResults(reader);
            var schemaType = Convert.ToString(reader["schema_type"]);

            return new Feed
            {
                Url = Convert.ToString(reader["url"]),
                Label = Convert.ToString(reader["label"]),
                Summary = Convert.ToString(reader["summary"]),
                OrganisationLabel = Convert.ToString(reader["organisation_label"]),
                OrganisationUrl = Convert.ToString(reader["organisation_url"]),
                DeveloperLabel = Convert.ToString(reader["developer_label"]),
                DeveloperUrl = Convert.ToString(reader["developer_url"]),
                ServicePathOverride = Convert.ToString(reader["service_path_override"]),
                SchemaType = string.IsNullOrEmpty(schemaType) ? null : schemaType,

                LastCheck = Convert.ToDateTime(reader["last_check"]),
                CheckIsRunning = Convert.ToBoolean(reader["check_is_running"]),
                TimeTaken = Convert.ToInt64(reader["time_taken"]),
                IsUp = Convert.ToBoolean(reader["is_up"]),
                IsServicesValid = Convert.ToBoolean(reader["is_services_valid"]),
                ServicesMessage = Convert.ToString(reader["services_message"]),
                IsServiceExampleValid = Convert.ToBoolean(reader["is_service_example_valid"]),
                ServiceExampleIdentifier = Convert.ToString(reader["service_example_identifier"]),
                ServiceExampleMessage = Convert.ToString(reader["service_example_message"]),
                IsSearchEnabled = Convert.ToBoolean(reader["is_search_enabled"]),
                SearchEnabledMessage = Convert.ToString(reader["search_enabled_message"]),
                SearchResults = searchResults
            };
        }

        private static List<BasicTestResult> GetSearchResults(IDataReader reader)
        {
            var searchEnabledMessage = Convert.ToString(reader["search_enabled_message"]);

            try
            {
                return Newtonsoft.Json.JsonConvert.DeserializeObject<List<BasicTestResult>>(searchEnabledMessage);
            }
            catch (Exception e)
            {
                return new List<BasicTestResult>();
            }
        }

        public List<Feed> GetFeeds()
        {
            var feeds = GetList(BuildFeed, "select * from feed;");

            var feedFilters = GetFeedFilters();

            foreach (var feed in feeds)
            {
                feed.Filters = feedFilters.Where(f => f.Url == feed.Url).Select(f => f.Filter).ToList();
            }

            return feeds;
        }

        public Feed GetFeed(string url)
        {
            var feed = GetItem(BuildFeed, "select * from feed where url = @url;", new KeyValuePair<string, object>("url", url));
            
            if (feed == null)
                return null;

            feed.Filters = GetFeedFilters(url).Select(f => f.Filter).ToList();

            return feed;
        }

        public Feed GetOldestFeed()
        {
            var feed = GetItem(BuildFeed, "select * from feed order by last_check, url limit 1;");
            
            if (feed == null)
                return null;

            feed.Filters = GetFeedFilters(feed.Url).Select(f => f.Filter).ToList();

            return feed;
        }

        public List<FeedFilter> GetFeedFilters()
        {
            return GetList(BuildFeedFilter, "select * from feed_filter;");
        }

        public List<FeedFilter> GetFeedFilters(string url)
        {
            return GetList(BuildFeedFilter, "select * from feed_filter where url = @url;", new KeyValuePair<string, object>("url", url));
        }

        private string EscapeField(string field) => $"`{field}`";

        private string ToParameter(string field) => $"@{field}";

        private string ToUpdate(string field) => $"{EscapeField(field)} = {ToParameter(field)}";

        private string ToProperty(string field) => string.Join("", field.Split('_').Select(f => f.First().ToString().ToUpper() + f.Substring(1)));

        private List<KeyValuePair<string, object>> ToParameteres<T>(T obj, params string[] fields) {
            var parameters = new List<KeyValuePair<string, object>>();

            var type = obj.GetType();

            foreach (var field in fields)
            {
                var property = ToProperty(field);
                var info = type.GetProperty(property);
                if (info == null)
                    continue;
                var value = info.GetValue(obj, null);
                parameters.Add(new KeyValuePair<string, object>(field, value));
            }

            return parameters;
        }

        public void UpsertFeed(Feed feed)
        {
            var table = "feed";
            var updateFields = new[] { "last_check", "check_is_running", "time_taken", "is_up", "is_services_valid", "services_message", "is_service_example_valid", "service_example_identifier", "service_example_message", "is_search_enabled", "search_enabled_message" };
            var fields = new[] { "url", "label", "summary", "organisation_label", "organisation_url", "developer_label", "developer_url", "service_path_override" }.Concat(updateFields).ToArray();

            var sql = $"insert into {table} " +
                $"({string.Join(", ", fields.Select(EscapeField))}) " +
                $"values ({string.Join(", ", fields.Select(ToParameter))}) " +
                $"on duplicate key update { string.Join(", ", updateFields.Select(ToUpdate)) };";

            var parameters = ToParameteres(feed, fields);

            Execute(sql, parameters.ToArray());
        }
    }
}

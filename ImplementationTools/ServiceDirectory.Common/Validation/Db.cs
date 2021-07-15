using MySql.Data.MySqlClient;
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

        public T GetItem<T>(Func<IDataReader, T> convertRow, string sql, params MySqlParameter[] parameters)
        {
            var results = GetList(convertRow, sql, parameters);
            return results.FirstOrDefault();
        }

        public List<T> GetList<T>(Func<IDataReader, T> convertRow, string sql, params MySqlParameter[] parameters)
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

        public MySqlParameter[] ToParameters(params Tuple<string, object>[] parameters)
        {
            return parameters.Select(p => new MySqlParameter(p.Item1, p.Item2)).ToArray();
        }

        public int Execute(string sql, params Tuple<string, object>[] parameters)
        {
            return Execute(sql, ToParameters(parameters));
        }

        public int Execute(string sql, params MySqlParameter[] parameters)
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

        private void AddParameters(MySqlCommand command, params MySqlParameter[] parameters)
        {
            if (parameters == null)
                return;

            foreach (var parameter in parameters)
            {
                command.Parameters.Add(parameter);
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

        public List<Feed> GetFeeds()
        {
            var feeds = GetList(Feed.Build, "select * from feed order by label;");

            var feedFilters = GetFeedFilters();

            foreach (var feed in feeds)
            {
                feed.Filters = feedFilters.Where(f => f.Url == feed.Url).Select(f => f.Filter).ToList();
            }

            return feeds;
        }

        public Feed GetFeed(string url)
        {
            var feed = GetItem(Feed.Build, "select * from feed where url = @url;", new MySqlParameter("url", url));
            
            if (feed == null)
                return null;

            feed.Filters = GetFeedFilters(url).Select(f => f.Filter).ToList();

            return feed;
        }

        public Feed GetOldestFeed()
        {
            var feed = GetItem(Feed.Build, "select * from feed order by last_check, url limit 1;");
            
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
            return GetList(BuildFeedFilter, "select * from feed_filter where url = @url;", new MySqlParameter("url", url));
        }

        private string EscapeField(string field) => $"`{field}`";

        private string ToParameter(string field) => $"@{field}";

        private string ToUpdate(string field) => $"{EscapeField(field)} = {ToParameter(field)}";

        private string ToProperty(string field) => string.Join("", field.Split('_').Select(f => f.First().ToString().ToUpper() + f.Substring(1)));

        private List<Tuple<string, object>> ToParameteres<T>(T obj, params string[] fields) {
            var parameters = new List<Tuple<string, object>>();

            var type = obj.GetType();

            foreach (var field in fields)
            {
                var property = ToProperty(field);
                var info = type.GetProperty(property);
                if (info == null)
                    continue;
                var value = info.GetValue(obj, null);
                parameters.Add(Tuple.Create(field, value));
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

        public List<RegisteredUser> GetRegisteredUsers()
        {
            var sql = $"select * from registered_user;";

            return GetList(RegisteredUser.Build, sql);
        }

        public RegisteredUser GetRegisteredUser(string email_address)
        {
            var sql = $"select * from registered_user where email_address = @email_address;";

            return GetItem(RegisteredUser.Build, sql, new MySqlParameter("@email_address", email_address));
        }

        public void RegisterUser(string email_address)
        {
            var sql = $"insert into registered_user (email_address) values (@email_address) on duplicate key update email_address = email_address;";

            Execute(sql, Tuple.Create<string, object>("@email_address", email_address));
        }

        public List<RegisteredUser> GetRegisteredOrganisations()
        {
            var sql = $"select * from registered_organisation;";

            return GetList(RegisteredUser.Build, sql);
        }

        public RegisteredOrganisation GetRegisteredOrganisation(int id)
        {
            var sql = $"select * from registered_organisation where id = @id;";

            return GetItem(RegisteredOrganisation.Build, sql, new MySqlParameter("@id", id));
        }

        public int RegisterOrganisation(string organisation_name, string organisation_type, string adoptation_stage, string url, string private_email_address, string public_email_address)
        {
            var sql = $"insert into registered_organisation " +
                $"(organisation_name, organisation_type, adoptation_stage, url, private_email_address, public_email_address) " +
                $"values (@organisation_name, @organisation_type, @adoptation_stage, @url, @private_email_address, @public_email_address); " +
                $"select last_insert_id() as id;";

            var parameters = new MySqlParameter[]
            {
                new MySqlParameter("@organisation_name", organisation_name),
                new MySqlParameter("@organisation_type", organisation_type),
                new MySqlParameter("@adoptation_stage", adoptation_stage),
                new MySqlParameter("@url", url),
                new MySqlParameter("@private_email_address", private_email_address),
                new MySqlParameter("@public_email_address", public_email_address)
            };

            var item = GetItem((IDataReader reader) => new { id = Convert.ToInt32(reader["id"]) }, sql, parameters);

            return item.id;
        }
    }
}

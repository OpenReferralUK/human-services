using ServiceDirectory.Common.Results;
using System;
using System.Collections.Generic;
using System.Data;

namespace ServiceDirectory.Common.Validation
{
    public class Feed
    {
        public string Url { get; set; }
        public string Label { get; set; }
        public string Summary { get; set; }
        public string OrganisationLabel { get; set; }
        public string OrganisationUrl { get; set; }
        public string DeveloperLabel { get; set; }
        public string DeveloperUrl { get; set; }
        public string ServicePathOverride { get; set; }
        public string SchemaType { get; set; }

        public DateTime LastCheck { get; set; }
        public bool CheckIsRunning { get; set; }
        public long TimeTaken { get; set; }

        public bool IsUp { get; set; }

        public bool IsServicesValid { get; set; }
        public string ServicesMessage { get; set; }

        public bool IsServiceExampleValid { get; set; }
        public string ServiceExampleIdentifier { get; set; }
        public string ServiceExampleMessage { get; set; }

        public bool IsSearchEnabled { get; set; }
        public string SearchEnabledMessage { get; set; }
        public object SearchResults { get; set; }

        public List<string> Filters { get; set; } = new List<string>();

        public bool IsCompleteSuccess
        {
            get
            {
                return IsUp && IsServicesValid && IsServiceExampleValid && IsSearchEnabled;
            }
        }

        public static Feed CreateRunning(Feed feed)
        {
            return new Feed
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

                LastCheck = DateTime.UtcNow,
                CheckIsRunning = true,
                TimeTaken = feed.TimeTaken,

                IsUp = feed.IsUp,

                IsServicesValid = feed.IsServicesValid,
                ServicesMessage = feed.ServicesMessage,

                IsServiceExampleValid = feed.IsServiceExampleValid,
                ServiceExampleIdentifier = feed.ServiceExampleIdentifier,
                ServiceExampleMessage = feed.ServiceExampleMessage,

                IsSearchEnabled = feed.IsSearchEnabled,
                SearchEnabledMessage = feed.SearchEnabledMessage,
                SearchResults = feed.SearchResults,

                Filters = feed.Filters,
            };
        }

        public static Feed Build(IDataReader reader)
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
    }
}

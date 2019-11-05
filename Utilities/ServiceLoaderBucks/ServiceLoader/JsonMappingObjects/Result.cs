using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;

namespace ServiceLoader.JsonMappingObjects
{
    public class Result
    {
        [JsonProperty("assetId")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("parentOrganisation")]
        public string Organisation { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("price")]
        public string Price { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; }

        [JsonProperty("keywords")]
        public string[] Keywords { get; set; }

        [JsonProperty("accessibility")]
        public string[] Accessibilities { get; set; }

        [JsonProperty("ageGroups")]
        public string[] AgeGroups { get; set; }

        [JsonProperty("suitability")]
        public string[] Suitabilities { get; set; }

        [JsonProperty("venue")]
        public string Venue { get; set; }

        [JsonProperty("area")]
        public string Area { get; set; }

        [JsonProperty("postcode")]
        public string PostCode { get; set; }

        [JsonProperty("geo")]
        public Geo Geo { get; set; }

        [JsonProperty("frequency")]
        public string Frequency { get; set; }

        [JsonProperty("days")]
        public string[] Days { get; set; }

        [JsonProperty("contactName")]
        public string ContactName { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }

        [JsonProperty("lastUpdated")]
        public DateTime? LastUpdated { get; set; }

        [JsonProperty("confidDataProtect")]
        public string ConfidentialData { get; set; }

        public bool HasConfidentialData => !string.IsNullOrEmpty(ConfidentialData) &&
                                    (ConfidentialData.StartsWith("true", StringComparison.OrdinalIgnoreCase) ||
                                     ConfidentialData.StartsWith("yes", StringComparison.OrdinalIgnoreCase));

        public string OrganisationId => Organisation ?? ServiceId;
        public string OrganisationName => Organisation ?? string.Empty;
        public string OrganisationDescription => Organisation ?? string.Empty;
        public string OrganisationUrl => Url;
        public string ServiceId => Id.ToString(CultureInfo.InvariantCulture);
        public string ServiceName => Name ?? string.Empty;
        public string ServiceDescription => Description ?? string.Empty;
        public string ServiceAreaId => Area?.ToLowerInvariant();
        public string LocationId => Venue?.ToLowerInvariant();
        public string LocationName => Venue?.ToLowerInvariant();
        public string LocationDescription => Venue?.ToLowerInvariant();
        public double? LocationLatitude => Geo?.Latitude;
        public double? LocationLongitude => Geo?.Longitude;
        public string ServiceAtLocationId => !string.IsNullOrEmpty(LocationId) ? $"{ServiceId}:{LocationId}" : null;
        public IEnumerable<Taxonomy> Taxonomies => TaxonomyBuilder.Build(this);
        public string ContactId => !string.IsNullOrEmpty(ContactName) ? $"{ServiceId}:{ContactName}" : ServiceId;
        public string AddressId => $"{LocationId}:{PostCode}:{LocationLongitude}:{LocationLatitude}";
        public string AddressLine1 => Venue;
        public string AddressCity => Area;
        public string AddressStateProvince => string.Empty;
        public string AddressCountry => "GB";
        public string AddressPostCode => PostCode ?? string.Empty;
        public IEnumerable<Schedule> Schedules => ScheduleBuilder.Build(this);
        public string CostOptionId => ServiceId;
    }
}
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
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
        public string PriceDescription { get; set; }

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

        public string OrganisationId = Guid.NewGuid().ToString();
        public string OrganisationName => !string.IsNullOrEmpty(Organisation) ? Organisation : "Unknown";
        public string OrganisationDescription => OrganisationName;
        public string OrganisationUrl => Url;
        public string ExternalServiceId => Id.ToString(CultureInfo.InvariantCulture);
        public string ServiceId = Guid.NewGuid().ToString();
        public string ServiceName => !string.IsNullOrEmpty(Name) ? Name : "Unknown";
        public string ServiceDescription => Description ?? string.Empty;
        public string ServiceAttendingType => string.IsNullOrEmpty(LocationId) ? "online" : null;
        private readonly string _serviceAreaId = Guid.NewGuid().ToString();
        public string ServiceAreaId => string.IsNullOrEmpty(Area) ? null : _serviceAreaId;
        private readonly string _locationId = Guid.NewGuid().ToString();
        public string LocationId => string.IsNullOrEmpty(Venue) ? null : _locationId;
        public string LocationName => Venue?.ToLowerInvariant();
        public string LocationDescription => Venue?.ToLowerInvariant();
        public double? LocationLatitude => Geo?.Latitude;
        public double? LocationLongitude => Geo?.Longitude;
        private readonly string _serviceAtLocationId = Guid.NewGuid().ToString();
        public string ServiceAtLocationId => !string.IsNullOrEmpty(LocationId) ? _serviceAtLocationId : null;
        public readonly string ContactId = Guid.NewGuid().ToString();
        public string AddressLine1 => Venue;
        public string AddressCity => Area;
        public readonly string AddressStateProvince = "Buckinghamshire";
        public readonly string AddressCountry = "GB";
        public string AddressPostCode => PostCode ?? string.Empty;
        public IEnumerable<Schedule> Schedules => ScheduleBuilder.Build(this);
        public decimal? PriceAmount => PriceParser.Parse(PriceDescription);

        private IEnumerable<Taxonomy> _taxonomies = null;
        public IEnumerable<Taxonomy> Taxonomies
        {
            get
            {
                if (_taxonomies == null) _taxonomies = TaxonomyBuilder.Build(this).ToList();
                return _taxonomies;
            }
        }
    }
}
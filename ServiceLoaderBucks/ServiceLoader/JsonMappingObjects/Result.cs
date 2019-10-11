using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
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

        [NotMapped]
        public string OrganisationId
        {
            get { return Organisation ?? ServiceId; }
        }

        [NotMapped]
        public string OrganisationName
        {
            get { return Organisation ?? string.Empty; }
        }

        [NotMapped]
        public string OrganisationDescription
        {
            get { return Organisation ?? string.Empty; }
        }

        [NotMapped]
        public string OrganisationUrl
        {
            get { return Url; }
        }

        [NotMapped]
        public string ServiceId
        {
            get { return Id.ToString(CultureInfo.InvariantCulture); }
        }

        [NotMapped]
        public string ServiceName
        {
            get { return Name ?? string.Empty; }
        }

        [NotMapped]
        public string ServiceDescription
        {
            get { return Description ?? string.Empty; }
        }

        [NotMapped]
        public string ServiceAreaId
        {
            get { return Area?.ToLowerInvariant(); }
        }

        [NotMapped]
        public string LocationId
        {
            get { return Venue?.ToLowerInvariant(); }
        }

        [NotMapped]
        public string LocationName
        {
            get { return Venue?.ToLowerInvariant(); }
        }

        [NotMapped]
        public string LocationDescription
        {
            get { return Venue?.ToLowerInvariant(); }
        }

        [NotMapped]
        public double? LocationLatitude
        {
            get { return Geo?.Latitude; }
        }

        [NotMapped]
        public double? LocationLongitude
        {
            get { return Geo?.Longitude; }
        }

        [NotMapped]
        public string ServiceAtLocationId
        {
            get { return !string.IsNullOrEmpty(LocationId) ? $"{ServiceId}:{LocationId}" : null; }
        }

        [NotMapped]
        public IEnumerable<Taxonomy> Taxonomies
        {
            get
            {
                if (!string.IsNullOrEmpty(Category)) yield return new Taxonomy($"category:{Category}", Category, "Bucks:category");
                foreach (var keyword in Keywords)
                {
                    yield return new Taxonomy($"keyword:{keyword}", keyword, "Bucks:keyword");
                }

                foreach (var accessibility in Accessibilities)
                {
                    yield return new Taxonomy($"accessibility:{accessibility}", accessibility, "Bucks:accessibility");
                }

                foreach (var ageGroup in AgeGroups)
                {
                    yield return new Taxonomy($"age-group:{ageGroup}", ageGroup, "Bucks:age-group");
                }

                foreach (var suitability in Suitabilities)
                {
                    yield return new Taxonomy($"suitability:{suitability}", suitability, "Bucks:suitability");
                }
            }
        }

        [NotMapped]
        public string ContactId
        {
            get { return !string.IsNullOrEmpty(ContactName) ? $"{ServiceId}:{ContactName}" : ServiceId; }
        }

        [NotMapped]
        public string AddressId
        {
            get { return $"{LocationId}:{PostCode}:{LocationLongitude}:{LocationLatitude}"; }
        }

        [NotMapped]
        public string AddressLine1
        {
            get { return Venue; }
        }

        [NotMapped]
        public string AddressCity
        {
            get { return Area; }
        }

        [NotMapped]
        public string AddressStateProvince
        {
            get { return string.Empty; }
        }

        [NotMapped]
        public string AddressCountry
        {
            get { return "England"; }
        }

        [NotMapped]
        public string AddressPostCode
        {
            get { return PostCode ?? string.Empty; }
        }

        [NotMapped]
        public IEnumerable<Schedule> Schedules
        {
            get
            {
                var validDays = new string[] { "SU", "MO", "TU", "WE", "TH", "FR", "SA" };
                foreach (var day in Days.Distinct())
                {
                    if (day.Length < 2) throw new Exception($"Invalid day {day} for service {ServiceId}");
                    var dayAbbrv = day.Substring(0, 2).ToUpperInvariant();
                    if (!validDays.Contains(dayAbbrv, StringComparer.Ordinal)) throw new Exception($"Invalid day {day} for service {ServiceId}");

                    yield return new Schedule($"{ServiceId}:{day}", dayAbbrv, Frequency);
                }
            }
        }

        [NotMapped]
        public string CostOptionId { get { return ServiceId; } }
    }
}
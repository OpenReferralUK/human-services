using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ServiceLoader.JsonMappingObjects
{
    public class Geo
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("coordinates")]
        public double[] Coordinates { get; set; }

        [NotMapped]
        public double? Latitude
        {
            get { return Coordinates.Length == 2 ? Coordinates[1] : (double?)null; }
        }

        [NotMapped]
        public double? Longitude
        {
            get { return Coordinates.Length == 2 ? Coordinates[0] : (double?)null; }
        }
    }
}

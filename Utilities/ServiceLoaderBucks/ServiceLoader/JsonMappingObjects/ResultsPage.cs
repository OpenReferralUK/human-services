using Newtonsoft.Json;

namespace ServiceLoader.JsonMappingObjects
{
    public class ResultsPage
    {
        [JsonProperty("pages")]
        public int PageCount { get; set; }

        [JsonProperty("results")]
        public Result[] Results { get; set; }
    }
}

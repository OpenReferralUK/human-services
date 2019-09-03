using Newtonsoft.Json;
using System.Collections.Generic;

namespace Convertor.Models
{
    public class JSONProperty
    {
        [JsonProperty(PropertyName = "$schema")]
        public string schema;
        public string title;
        public string type;
        public string format;
        public string pattern;
        [JsonIgnore]
        public string description;
        public JSONProperty items;
        public Dictionary<string, JSONProperty> properties = null;
        public List<string> required = null;
        [JsonProperty(PropertyName = "enum")]
        public List<string> enumValues = null;

        public void SetType(string value)
        {
            if (value == "time")
            {
                type = "string";
                format = value;
            }
            else if (value == "date")
            {
                type = "string";
                format = value;
            }
            else if (value == "datetime")
            {
                type = "string";
                format = "date-time";
            }
            else
            {
                type = value;
            }
        }

        public void SetFormat(string value)
        {
            if (!string.IsNullOrEmpty(format))
            {
                return;
            }

            if (value == "uuid")
            {
                pattern = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
            }
            else if (value == "url")
            {
                format = "uri";
                pattern = "^(https?|wss?|ftp)://";
            }
            else if (value == "email")
            {
                format = value;
            }
            else
            {
                pattern = value;
            }
        }
    }
}

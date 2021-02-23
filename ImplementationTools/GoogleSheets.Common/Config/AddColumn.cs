using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace GoogleSheets.Common.Config
{
    public class AddColumn
    {
        [JsonProperty]
        public string Sheet { get; set; }
        [JsonProperty]
        public string Title { get; set; }
        [JsonProperty]
        public string Comment { get; set; }
        [JsonProperty]
        public string Value { get; set; }
    }
}

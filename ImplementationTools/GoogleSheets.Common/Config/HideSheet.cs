using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace GoogleSheets.Common.Config
{
    public class HideSheet
    {
        [JsonProperty]
        public string Sheet { get; set; }
    }
}

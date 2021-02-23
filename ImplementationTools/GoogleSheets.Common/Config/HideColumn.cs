using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace GoogleSheets.Common.Config
{
    public class HideColumn
    {
        [JsonProperty]
        public string Column { get; set; }
    }
}

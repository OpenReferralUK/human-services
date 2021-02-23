using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace GoogleSheets.Common.Config
{
    public class CommentColumn
    {
        [JsonProperty]
        public string Column { get; set; }

        [JsonProperty]
        public string Comment { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace SchemaBuilder.Models
{
    public class IncludeAttribute
    {
        public string Field { get; set; }
        [IgnoreDataMember]
        public string Description { get; set; }
        [IgnoreDataMember]
        public string Type { get; set; }
        [IgnoreDataMember]
        public string Format { get; set; }
        [IgnoreDataMember]
        public bool Required { get; set; }
        [IgnoreDataMember]
        public bool Unique { get; set; }
        public bool Include { get; set; }

        public IncludeAttribute() { }
    }
}

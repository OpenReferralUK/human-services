using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceDirectory.Common.DataStandard.Models
{
    public class Field
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Format { get; set; }
        public bool Required { get; set; }
        public bool Unique { get; set; }

        public Field() { }
    }
}

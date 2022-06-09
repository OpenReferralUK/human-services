using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchemaBuilder.Models
{
    public class IncludeAttribute
    {
        public string Field { get; set; }
        public bool Include { get; set; }

        public IncludeAttribute() { }
    }
}

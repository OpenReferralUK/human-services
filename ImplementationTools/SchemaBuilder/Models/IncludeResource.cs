using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchemaBuilder.Models
{
    public class IncludeResource
    {
        public string Name { get; set; }
        public List<IncludeAttribute> Attributes { get; set; }
        public bool IsEmpty()
        {
            if (Attributes == null || Attributes.Count == 0)
            {
                return true;
            }
            foreach (IncludeAttribute attr in Attributes)
            {
                if (attr.Include)
                {
                    return false;
                }
            }
            return true;
        }
        public IncludeResource()
        {
        }
    }
}

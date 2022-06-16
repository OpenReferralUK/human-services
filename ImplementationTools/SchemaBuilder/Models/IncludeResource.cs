using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace SchemaBuilder.Models
{
    public class IncludeResource
    {
        public string Name { get; set; }
        [IgnoreDataMember]
        public string Description { get; set; }
        public List<IncludeAttribute> Attributes { get; set; }
        [IgnoreDataMember]
        public bool IsEmpty
        {
            get
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
        }

        [IgnoreDataMember]
        public bool AllSelected
        {
            get
            {
                if (Attributes == null || Attributes.Count == 0)
                {
                    return false;
                }
                foreach (IncludeAttribute attr in Attributes)
                {
                    if (!attr.Include)
                    {
                        return false;
                    }
                }
                return true;
            }
        }
        public IncludeResource()
        {
        }
    }
}

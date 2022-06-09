using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceDirectory.Common.DataStandard.Models
{
    public class Resource
    {
        public string Name { get; set; }
        public List<Field> Fields { get; set; }

        public Resource()
        {
            Fields = new List<Field>();
        }
    }
}

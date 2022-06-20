using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceDirectory.Common.DataStandard.Models
{
    public class Package
    {
        public List<Resource> Resources { get; set; }
        public string Version { get; set; }
        public Package()
        {
            Resources = new List<Resource>();
        }
    }
}

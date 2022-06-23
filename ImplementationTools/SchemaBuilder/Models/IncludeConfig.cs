using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchemaBuilder.Models
{
    public class IncludeConfig
    {
        public string ExtendedDataPackageURL { get; set; }
        public string FileName { get; set; }
        public string ProfileName { get; set; }
        public string ProfileIdentifier { get; set; }
        public string Version { get; set; }
        public string OriginalVersion { get; set; }
        public bool Selected { get; set; }
        public List<IncludeResource> Resources { get; set; }
        public IncludeConfig()
        {
        }
    }
}

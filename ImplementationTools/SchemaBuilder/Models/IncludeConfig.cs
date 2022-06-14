﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchemaBuilder.Models
{
    public class IncludeConfig
    {
        public string ExtendedDataPackageURL { get; set; }
        public List<IncludeResource> Resources { get; set; }
        public IncludeConfig()
        {
        }
    }
}
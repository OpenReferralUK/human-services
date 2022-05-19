using System;
using System.Configuration;
using System.Linq;

namespace ORUKTaxonomy.Web.Models
{
    public class BaseURL
    {
        public string URL
        {
            get;set;
        }

        [ConfigurationProperty("requestrate", IsKey = false, IsRequired = true)]
        public int RequestRate
        {
            get; set;
        }
    }

    public class AppSettings
    {
        public BaseURL[] Urls { get; set; }
    }
}

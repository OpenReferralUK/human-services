using System.Collections.Generic;
using System.Web;

namespace ServiceDirectory.Common.FeatureTests
{
    public class TaxonomyTest : IFeatureTest
    {
        internal string id;
        internal string vocabulary;

        public TaxonomyTest(string serviceId)
        {
            ServiceID = serviceId;
        }

        public static string TestName = "Taxonomy Test";

        public string Name { get { return TestName; } }

        public string Parameters
        {
            get
            {
                List<string> parameters = new List<string>();
                if (!string.IsNullOrEmpty(id))
                {
                    parameters.Add("taxonomy_id=" + HttpUtility.UrlEncode(id));
                }
                if (!string.IsNullOrEmpty(vocabulary))
                {
                    parameters.Add("vocabulary=" + HttpUtility.UrlEncode(vocabulary));
                }
                return "?" + string.Join("&", parameters);
            }
        }

        public string ServiceID { get; private set; }

        public bool IsValid()
        {
            return !string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(vocabulary);
        }

        public int CompareTo(object obj)
        {
            return 0;
        }
    }
}

using System;
using System.Web;

namespace ServiceDirectory.Common.FeatureTests
{
    public class PostCodeTest : IFeatureTest
    {
        private string postcode;

        public PostCodeTest(string postcode, string serviceId)
        {
            this.postcode = postcode;
            ServiceID = serviceId;
        }

        public string Name
        {
            get { return "Postcode Search"; }
        }

        public string Parameters
        {
            get { return "?proximity=100&postcode=" + HttpUtility.UrlEncode(postcode); }
        }

        public string ServiceID { get; private set; }

        public int CompareTo(object obj)
        {
            return 0;
        }
    }
}

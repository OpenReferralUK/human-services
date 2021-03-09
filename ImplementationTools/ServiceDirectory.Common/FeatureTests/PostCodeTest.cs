using System;
using System.Web;

namespace ServiceDirectory.Common.FeatureTests
{
    public class PostCodeTest : IFeatureTest
    {
        private string postcode;
        private string serviceId;

        public PostCodeTest(string postcode, string serviceId)
        {
            this.postcode = postcode;
            this.serviceId = serviceId;
        }

        public string Name
        {
            get { return "Postcode Search"; }
        }

        public string Parameters
        {
            get { return "?proximity=100&postcode=" + HttpUtility.UrlEncode(postcode); }
        }

        public async System.Threading.Tasks.Task<bool> Execute(string apiBaseUrl)
        {
            dynamic serviceList = await WebServiceReader.ConvertToDynamic(apiBaseUrl + "services"+ Parameters);
            if (serviceList == null)
            {
                return false;
            }
            try
            {
                foreach (dynamic s in serviceList.content)
                {
                    if (s != null && Convert.ToString(s.id.Value) == serviceId)
                    {
                        return true;
                    }
                }
            }
            catch
            {
                return false;
            }
            return false;
        }
    }
}

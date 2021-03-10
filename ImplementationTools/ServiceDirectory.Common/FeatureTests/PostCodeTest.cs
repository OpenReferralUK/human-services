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

        public int CompareTo(object obj)
        {
            return 0;
        }

        public async System.Threading.Tasks.Task<bool> Execute(string apiBaseUrl)
        {
            bool result = false;
            Paginator paginator = new Paginator();
            try
            {
                await paginator.PaginateServices(apiBaseUrl, async delegate (dynamic serviceList, int totalPages)
                {
                    if (serviceList == null)
                    {
                        result = false;
                    }
                    foreach (dynamic s in serviceList.content)
                    {
                        if (s != null && Convert.ToString(s.id.Value) == serviceId)
                        {
                            result = true;
                        }
                    }
                }, Parameters);
            }
            catch
            {
                return false;
            }
            return result;
        }
    }
}

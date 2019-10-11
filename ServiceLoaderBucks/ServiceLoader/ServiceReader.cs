using Newtonsoft.Json;
using ServiceLoader.JsonMappingObjects;
using System.Configuration;
using System.Net;
using System.Text;

namespace ServiceLoader
{
    internal class ServiceReader
    {
        private readonly string _stub;

        public ServiceReader()
        {
            _stub = ConfigurationManager.AppSettings["ApiURI"];
        }

        internal ResultsPage ReadPage(int pageNumber)
        {
            using (var client = new WebClient())
            {
                client.Encoding = Encoding.UTF8;
                var url = $"{_stub}?page={pageNumber}";
                var results = client.DownloadString(url);
                return JsonConvert.DeserializeObject<ResultsPage>(results);
            }
        }
    }
}

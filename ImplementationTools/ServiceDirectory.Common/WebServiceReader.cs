using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ServiceDirectory.Common
{
    internal class WebServiceReader
    {
        private static HttpClient client;

        static WebServiceReader()
        {
            client = new HttpClient();
        }
        internal static async System.Threading.Tasks.Task<dynamic> ConvertToDynamic(string url, int attempt = 0)
        {
            var response = await client.GetAsync(url);
            byte[] result = await response.Content.ReadAsByteArrayAsync();
            string s = Encoding.UTF8.GetString(result);
            try
            {
                return Newtonsoft.Json.JsonConvert.DeserializeObject(s);
            }
            catch(Exception e)
            {
                if (response != null && response.StatusCode == (System.Net.HttpStatusCode)429)
                {
                    attempt++;
                    if (attempt < 3)
                    {
                        await Task.Delay(60000);
                        return await ConvertToDynamic(url, attempt).ConfigureAwait(false);
                    }
                }
                return null;
            }
        }
    }
}

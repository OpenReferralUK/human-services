using System;
using System.Net;

namespace ServiceDirectory.Common
{
    public class UrlChecker
    {

        private readonly IWebRequestCreate webRequest;

        public UrlChecker(IWebRequestCreate webRequest)
        {
            this.webRequest = webRequest;
        }

     
        public bool UrlCheck(string url)
        {
            Uri uri = new Uri(url);
            HttpWebRequest request = (HttpWebRequest)webRequest.Create(uri);
            Console.WriteLine("is req: " + request);
            request.Method = "HEAD";

            try
            {
                //think this does aut cleanup
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    //add 449 check
                    return response.StatusCode != HttpStatusCode.NotFound;
                }
            }
            catch (WebException)
            {
                return false;
            }
        }
    }
}

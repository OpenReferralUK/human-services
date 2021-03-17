using System;
using System.Text.RegularExpressions;
using System.Net;

namespace ServiceDirectory.Common
{
    public  class Urls
    {
        private readonly string url;
       

        public Urls(string url)
        {
            this.url = url;
        }

        public bool UrlAbsolute()
        {
            if (!Uri.TryCreate(url, UriKind.Absolute, out _))
            {
                return false;
            }
            return true;
        }
        

        public  bool UrlValid()
        {
            Regex urlPattern = new Regex(@"^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$");
            Match matches = urlPattern.Match(url);
            return matches.Success;
        }



       
    }
}

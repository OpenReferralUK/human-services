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

        public  bool urlValid()
        {
            Regex urlPattern = new Regex(@"^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$");
            Match matches = urlPattern.Match(url);
            return matches.Success;
        }

       
    }
}

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ServiceDirectory.Common
{
    public class WebServiceReader
    {
        private DateTime lastReset;
        private int callCount;
        private static HttpClient client;
        private SemaphoreSlim locker = new SemaphoreSlim(1,1);
        private readonly APIValidatorSettings settings;

        public WebServiceReader(APIValidatorSettings settings)
        {
            Reset();
            client = new HttpClient();
            this.settings = settings;
        }

        private void Reset()
        {
            lastReset = DateTime.Now.AddMinutes(1);
            callCount = 0;
        }

        internal async System.Threading.Tasks.Task<WebServiceResponse> ConvertToDynamic(string url, int attempt = 0)
        {
            try
            {
                try
                {
                    await locker.WaitAsync();

                    if ((lastReset - DateTime.Now).TotalSeconds <= 0)
                    {
                        Reset();
                    }                    

                    if (callCount >= settings.RequestRate)
                    {
                        int timeout = Convert.ToInt32((lastReset - DateTime.Now).TotalMilliseconds);
                        await Task.Delay(timeout);
                        Reset();
                    }

                    callCount++;
                }
                finally
                {
                    locker.Release();
                }

                var response = await client.GetAsync(url);
                if (response.StatusCode == (System.Net.HttpStatusCode)429)
                {
                    attempt++;
                    if (attempt < 5)
                    {
                        await Task.Delay(60000);
                        return await ConvertToDynamic(url, attempt).ConfigureAwait(false);
                    }
                    return null;
                }
                byte[] result = await response.Content.ReadAsByteArrayAsync();
                return new WebServiceResponse(result);
            }
            catch(Exception e)
            {
                return null;
            }
        }
    }
}

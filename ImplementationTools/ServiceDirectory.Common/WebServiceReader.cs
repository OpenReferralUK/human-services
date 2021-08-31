using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ServiceDirectory.Common
{
    internal class WebServiceReader
    {
        private static DateTime lastReset;
        private static int callCount;
        private static HttpClient client;
        private static SemaphoreSlim locker = new SemaphoreSlim(1,1);

        static WebServiceReader()
        {
            Reset();
            client = new HttpClient();
        }

        private static void Reset()
        {
            lastReset = DateTime.Now.AddMinutes(1);
            callCount = 0;
        }

        internal static async System.Threading.Tasks.Task<dynamic> ConvertToDynamic(string url, int attempt = 0)
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
                    callCount++;

                    if (callCount >= 100)
                    {
                        int timeout = Convert.ToInt32((lastReset - DateTime.Now).TotalMilliseconds);
                        await Task.Delay(timeout);
                        Reset();
                    }
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
                string s = Encoding.UTF8.GetString(result);
                return Newtonsoft.Json.JsonConvert.DeserializeObject(s);
            }
            catch(Exception e)
            {
                return null;
            }
        }
    }
}

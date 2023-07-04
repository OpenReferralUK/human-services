using System;
using System.Threading;
using System.Threading.Tasks;

namespace GoogleSheets.Common
{
    internal class Throttler
    {
        private const int MAX_AMOUNT = 59;
        private static SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);
        private static int count = MAX_AMOUNT;
        private static DateTime? lastReset;
        internal static async System.Threading.Tasks.Task ThrottleCheck()
        {
            try
            {
                await semaphoreSlim.WaitAsync().ConfigureAwait(false);
                if (count == MAX_AMOUNT || (lastReset.HasValue && (DateTime.Now - lastReset.Value).TotalMilliseconds >= 60000))
                {
                    lastReset = DateTime.Now;
                    count = MAX_AMOUNT;
                }
                count--;
                if (count <= 0)
                {
                    double wait = (DateTime.Now - lastReset.Value).TotalMilliseconds;
                    if (wait > 0 && wait < 60000)
                    {
                        await Task.Delay(Convert.ToInt32(60000 - wait)).ConfigureAwait(false);
                    }
                    lastReset = DateTime.Now;
                    count = MAX_AMOUNT;
                }
            }
            finally
            {
                //When the task is ready, release the semaphore. It is vital to ALWAYS release the semaphore when we are ready, or else we will end up with a Semaphore that is forever locked.
                //This is why it is important to do the Release within a try...finally clause; program execution may crash or take a different path, this way you are guaranteed execution
                semaphoreSlim.Release();
            }
        }
    }
}

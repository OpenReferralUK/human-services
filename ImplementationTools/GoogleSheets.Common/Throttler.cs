using System;
using System.Threading;
using System.Threading.Tasks;

namespace GoogleSheets.Common
{
    internal class Throttler
    {
        private static SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);
        private static int count = 0;
        internal static async System.Threading.Tasks.Task ThrottleCheck()
        {
            try
            {
                await semaphoreSlim.WaitAsync().ConfigureAwait(false);
                count++;
                if (count >= 59)
                {
                    await Task.Delay(60000).ConfigureAwait(false);
                    count = 0;
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

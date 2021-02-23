using Google.Apis.Util.Store;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace GoogleSheets.Common
{
    /// <summary>
    /// A null datastore. Nothing is stored, nothing is retrievable.
    /// </summary>
    public class NullDataStore : IDataStore
    {
        private static readonly Task s_completedTask = CompletedTask<int>();

        private static Task<T> CompletedTask<T>()
        {
            var tcs = new TaskCompletionSource<T>();
            tcs.SetResult(default(T));
            return tcs.Task;
        }

        /// <summary>
        /// Construct a new null datastore, that stores nothing.
        /// </summary>
        public NullDataStore()
        {
        }

        /// <inheritdoc/>
        public Task ClearAsync() => s_completedTask;

        /// <inheritdoc/>
        public Task DeleteAsync<T>(string key) => s_completedTask;

        /// <summary>
        /// Asynchronously returns the stored value for the given key or <c>null</c> if not found.
        /// This implementation of <see cref="IDataStore"/> will always return a completed task
        /// with a result of <c>null</c>. 
        /// </summary>
        /// <typeparam name="T">The type to retrieve from the data store.</typeparam>
        /// <param name="key">The key to retrieve its value.</param>
        /// <returns>Always <c>null</c>.</returns>
        public Task<T> GetAsync<T>(string key) => CompletedTask<T>();

        /// <summary>
        /// Asynchronously stores the given value for the given key (replacing any existing value).
        /// This implementation of <see cref="IDataStore"/> does not store the value,
        /// and will not return it in future calls to <see cref="GetAsync{T}(string)"/>. 
        /// </summary>
        /// <typeparam name="T">The type to store in the data store.</typeparam>
        /// <param name="key">The key.</param>
        /// <param name="value">The value.</param>
        /// <returns>A task that completes immediately.</returns>
        public Task StoreAsync<T>(string key, T value) => s_completedTask;
    }
}

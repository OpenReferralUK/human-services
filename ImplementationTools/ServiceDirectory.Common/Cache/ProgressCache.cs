using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceDirectory.Common.Cache
{
    public class ProgressCache
    {
        private static MemoryCache _cache = new MemoryCache(new MemoryCacheOptions()
        {
            SizeLimit = 1024,
        });

        private static MemoryCacheEntryOptions CreateCacheOptions()
        {
            return new MemoryCacheEntryOptions()
             .SetSize(1)//Size amount
                        //Priority on removing when reaching size limit (memory pressure)
                .SetPriority(CacheItemPriority.High)
                // Keep in cache for this time, reset time if accessed.
                .SetSlidingExpiration(TimeSpan.FromDays(1))
                // Remove from cache after this time, regardless of sliding expiration
                .SetAbsoluteExpiration(TimeSpan.FromDays(1));
        }

        public static void Update(string id, int currentPage, int totalPages)
        {
            if (string.IsNullOrEmpty(id))
            {
                return;
            }
            Progress cacheEntry;
            if (_cache.TryGetValue(id, out cacheEntry))
            {
                cacheEntry.CurrentPage = currentPage;
                cacheEntry.TotalPages = totalPages;
            }
            else
            {
                cacheEntry = new Progress();
                cacheEntry.CurrentPage = currentPage;
                cacheEntry.TotalPages = totalPages;
            }
            _cache.Set(id, cacheEntry, CreateCacheOptions());
        }

        public static Progress Get(string id)
        {
            Progress cacheEntry;
            if (_cache.TryGetValue(id, out cacheEntry))// Look for cache key.
            {
                return cacheEntry;
            }
            return new Progress();
        }
    }
}

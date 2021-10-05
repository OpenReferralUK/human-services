using System.Collections.Generic;

namespace ServiceDirectory.Common
{
    public class DelayeredResult
    {
        public DelayeredResult(Dictionary<string, Dictionary<string, dynamic>> collection, HashSet<int> hashes)
        {
            Collection = collection;
            Hashes = hashes;
        }

        public Dictionary<string, Dictionary<string, dynamic>> Collection { get; }
        public HashSet<int> Hashes { get; }
    }
}

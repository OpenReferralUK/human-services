using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace Combiner
{
    public class HashDatabase
    {
        private const string Path = "settings.json";

        public HashDatabase()
        {
            Hashes = new Dictionary<string, HashSet<int>>();
        }

        internal HashSet<int> Get(string key)
        {
            if (Hashes.ContainsKey(key))
            {
                return Hashes[key];
            }
            return new HashSet<int>();
        }

        internal void Load()
        {
            if (!File.Exists(Path))
            {
                return;
            }
            HashDatabase database = (HashDatabase)Newtonsoft.Json.JsonConvert.DeserializeObject(File.ReadAllText(Path), typeof(HashDatabase));
            if (database != null)
            {
                Hashes = database.Hashes;
            }
        }
        internal void Save()
        {
            File.WriteAllText(Path, JsonSerializer.Serialize(this));
        }

        public Dictionary<string, HashSet<int>> Hashes { get; private set; }
    }
}

using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;

namespace Convertor.Models
{
    public class JSONTable
    {
        public List<JSONTableResource> resources;

        public JSONTable(List<Table> tables)
        {
            resources = new List<JSONTableResource>();
            foreach(Table table in tables)
            {
                resources.Add(new JSONTableResource(table));
            }
        }

        public void Generate(string filename)
        {
            if (string.IsNullOrEmpty(filename))
            {
                filename = "tableschema.json";
            }
            else
            {
                filename += ".json";
            }

            string json = JsonConvert.SerializeObject(this, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            File.WriteAllText(filename, json);
        }
    }
}

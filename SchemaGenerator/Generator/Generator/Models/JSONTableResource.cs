using System.Collections.Generic;

namespace Convertor.Models
{
    public class JSONTableResource
    {
        public string name;
        public JSONTableSchema schema;

        public JSONTableResource(Table table)
        {
            name = table.Name;
            schema = new JSONTableSchema(table);
        }
    }
}

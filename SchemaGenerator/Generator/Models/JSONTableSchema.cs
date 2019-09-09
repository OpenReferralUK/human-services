using System.Collections.Generic;

namespace Convertor.Models
{
    public class JSONTableSchema
    {
        public List<JSONTableField> fields;
        public List<JSONTableForeignKey> foreignKeys;
        public string primaryKey;

        public JSONTableSchema(Table table)
        {
            primaryKey = table.PrimaryKey;
            fields = new List<JSONTableField>();

            foreach (Column column in table.Columns)
            {
                fields.Add(new JSONTableField(column));
            }

            if (table.ForeignKeys != null && table.ForeignKeys.Count > 0)
            {
                foreignKeys = new List<JSONTableForeignKey>();
                foreach (ForeignKeyReference f in table.ForeignKeys)
                {
                    foreignKeys.Add(new JSONTableForeignKey(f));
                }
            }
        }
    }
}

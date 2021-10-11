using System;
using System.Collections.Generic;
using System.Text;

namespace Combiner
{
    internal class Row
    {
        private const string QUOTATION = "\"";
        private const string COLUMN_ESCAPE = "`";
        internal List<string> Values { get; set; }
        internal List<string> Fields { get; set; }

        private string resourceName;
        
        internal Row(string resourceName) {
            this.resourceName = resourceName;
            Values = new List<string>();
            Fields = new List<string>();
        }

        internal string ToSQL(Dictionary<string, Dictionary<string, string>> keyReWrite)
        {
            List<string> vals = new List<string>(Values);
            foreach (string field in Fields)
            {
                string originalKey = field.Replace(COLUMN_ESCAPE, string.Empty);
                string fieldResource = originalKey.Replace("_id", string.Empty);
                if (fieldResource == resourceName)
                {
                    continue;
                }
                if (keyReWrite.ContainsKey(fieldResource))
                {
                    int index = Fields.IndexOf(field);
                    originalKey = vals[index].Replace(QUOTATION, string.Empty);
                    if (keyReWrite[fieldResource].ContainsKey(originalKey))
                    {
                        vals[index] = QUOTATION + keyReWrite[fieldResource][originalKey] + QUOTATION;
                    }
                }
            }

            return string.Format("INSERT IGNORE INTO {0} ({1}) VALUES ({2});", resourceName, string.Join(", ", Fields), string.Join(", ", vals));
        }
    }
}

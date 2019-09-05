using Generator;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor.Models
{
    internal class SQL
    {
        List<Table> tables = new List<Table>();

        internal SQL(List<Table> tables)
        {
            this.tables = tables;
        }

        internal void Generate(Options options)
        {
            StringBuilder sb = new StringBuilder();

            tables = Order(tables);

            foreach (Table table in tables)
            {
                sb.Append(table.ToSQL(options));
                sb.AppendLine();
            }

            File.WriteAllText(FileUtility.CreatePath(options, "database.sql", ".sql"), sb.ToString());
        }

        private List<Table> Order(List<Table> ts)
        {
            HashSet<string> ordered = new HashSet<string>();
            List<Table> results = new List<Table>();
            foreach (Table t in ts)
            {
                if (t.ForeignKeys == null || t.ForeignKeys.Count == 0)
                {
                    AddTable(ordered, results, t);
                }
            }

            do
            {
                foreach (Table t in ts)
                {
                    if (ordered.Contains(t.Name))
                    {
                        continue;
                    }
                    if (t.ForeignKeys != null)
                    {
                        int total = t.ForeignKeys.Count;
                        foreach (ForeignKeyReference fkey in t.ForeignKeys)
                        {
                            if (ordered.Contains(fkey.ReferenceTableName))
                            {
                                total--;
                            }
                        }
                        if (total == 0)
                        {
                            AddTable(ordered, results, t);
                        }
                    }
                }
            }
            while (results.Count != ts.Count);

            return results;
        }

        private static void AddTable(HashSet<string> ordered, List<Table> results, Table t)
        {
            ordered.Add(t.Name);
            results.Add(t);
        }
    }
}

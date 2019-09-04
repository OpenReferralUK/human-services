using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor.Models
{
    internal class HTML
    {
        List<Table> tables = new List<Table>();

        internal HTML(List<Table> tables)
        {
            this.tables = tables;
        }

        internal void Generate(string filename)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(@"<html><body><style>
            table {
                width:100%;
                border-collapse: collapse;
            }

            table, th, td {
                min-width:15%;
                border: 1px solid black;
            }</style>");

            foreach(Table table in tables)
            {
                sb.Append(table.ToHTML());
            }

            sb.Append("</body></html>");

            if (string.IsNullOrEmpty(filename))
            {
                filename = "documentation.html";
            }
            else
            {
                filename += ".gv";
            }

            File.WriteAllText(filename, sb.ToString());
        }
    }
}

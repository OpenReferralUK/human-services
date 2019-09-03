using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor.Models
{
    internal class ERD
    {
        List<Table> tables = new List<Table>();

        internal ERD(List<Table> tables)
        {
            this.tables = tables;
        }

        internal void Generate(string filename, Options options)
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendFormat("digraph {0}", options.Title);

            sb.Append(@" { 

            overlap = false;
            splines = true;
            ranksep = 1;
            pack = true;

");
            sb.AppendFormat("label = \"{0}\";", options.Title);
            sb.AppendLine("labelloc = \"t\";");

            sb.Append(@"node[shape = none, margin = 0, color = black, fontname = ""Arial"", fontcolor = black, fontsize = 14];
            // One-to-many relation (from one, to many)
            edge[arrowhead = crow, arrowtail = none, dir = both];

");
            foreach(Table table in tables)
            {
                sb.Append(table.ToGV());
            }

            sb.AppendLine("}");

            if (string.IsNullOrEmpty(filename))
            {
                filename = "datapackage.gv";
            }
            else
            {
                filename += ".gv";
            }

            File.WriteAllText(filename, sb.ToString());
        }
    }
}

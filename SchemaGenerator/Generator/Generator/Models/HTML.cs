using Generator;
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

        internal void Generate(Options options)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(@"<html><body><style>
            table {
                width:100%;
                border-collapse: collapse;
            }

            table, th, td {
                border: 1px solid black;
            }

            th{
                text-align:left;
            }

            ul{
                padding-left:1em;
                margin:0;
            }

            </style>");

            foreach(Table table in tables)
            {
                sb.Append(table.ToHTML());
            }

            sb.Append("</body></html>");

            File.WriteAllText(FileUtility.CreatePath(options, "documentation.html", ".html"), sb.ToString());
        }
    }
}

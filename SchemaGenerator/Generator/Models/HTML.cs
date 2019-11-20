using Generator;
using Generator.Models;
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
        private DataPackage dataPackage;

        internal HTML(DataPackage dataPackage)
        {
            this.dataPackage = dataPackage;
        }

        internal void Generate(Options options)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(@"<html>");
            if (!string.IsNullOrEmpty(dataPackage.Title))
            {
                sb.AppendFormat(@"<title>{0}</title>", dataPackage.Title);
            }
            sb.Append(@"<body><style>
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

            if (!string.IsNullOrEmpty(dataPackage.Title))
            {
                sb.AppendFormat(@"<h1>{0}</h1>", dataPackage.Title);
            }

            if (!string.IsNullOrEmpty(dataPackage.Description))
            {
                sb.AppendFormat(@"<p>{0}</p>", dataPackage.Description);
            }

            foreach (Table table in dataPackage.Tables)
            {
                sb.Append(table.ToHTML(options));
            }

            sb.Append("</body></html>");

            File.WriteAllText(FileUtility.CreatePath(options, "documentation.html", ".html"), sb.ToString());
        }
    }
}

using System.Collections.Generic;
using System.Text;

namespace Convertor.Models
{
    public class Table
    {
        internal Table(string name, dynamic source, dynamic primaryKey)
        {
            this.Name = name;
            this.Source = string.Empty;
            if (source != null)
            {
                this.Source = source.Value;
            }
            if (primaryKey != null)
            {
                this.PrimaryKey = primaryKey.Value;
            }
            this.Columns = new List<Column>();
            this.ForeignKeys = new List<ForeignKeyReference>();
        }

        internal string Name
        {
            get;
            private set;
        }

        internal string PrimaryKey
        {
            get;
            private set;
        }

        internal string Source
        {
            get;
            private set;
        }

        internal List<Column> Columns
        {
            get;
            private set;
        }

        internal List<ForeignKeyReference> ForeignKeys
        {
            get;
            set;
        }

        internal string ToGV()
        {
            StringBuilder table = new StringBuilder();
            table.AppendLine();
            table.AppendLine(string.Format("{0} [label=<", Name));
            table.AppendLine("<table border=\"0\" cellborder=\"1\" cellspacing=\"0\" cellpadding=\"4\">");
            table.AppendLine(string.Format("<tr><td bgcolor=\"{0}\"><b>{1}</b></td></tr>", Utility.GetSourceColour(Source, "lightgrey"), Name));

            HashSet<string> hidden = new HashSet<string>();
            foreach(Column column in Columns)
            {                
                if (column.IsHidden)
                {
                    hidden.Add(column.Name);
                    continue;
                }
                table.AppendLine(column.ToGV());
            }

            table.AppendLine("</table>");
            table.AppendLine(">]");
            table.AppendLine();

            foreach(ForeignKeyReference foreignKey in ForeignKeys)
            {
                table.AppendLine(foreignKey.ToGV(hidden.Contains(foreignKey.TableField), PrimaryKey));
            }

            table.AppendLine();

            return table.ToString();
        }
    }
}

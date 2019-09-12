using System.Collections.Generic;
using System.Text;

namespace Convertor.Models
{
    public class Table
    {
        internal Table(string name, dynamic description, dynamic source, dynamic applicationProfile, dynamic primaryKey)
        {
            this.Name = name;
            this.Source = string.Empty;
            if (source != null)
            {
                this.Source = source.Value;
            }
            if (description != null)
            {
                this.Description = description.Value;
            }
            if (applicationProfile != null)
            {
                if (applicationProfile.name != null)
                {
                    this.ApplicationProfile = applicationProfile.name.Value;
                }
                if (applicationProfile.notes != null)
                {
                    if (!string.IsNullOrEmpty(this.Description))
                    {
                        this.Description += "\r\n";
                    }
                    this.Description += applicationProfile.notes;
                }
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

        internal string Description
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

        internal string ApplicationProfile
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

        internal bool IsOriginal
        {
            get
            {
                if (Columns == null)
                {
                    return true;
                }
                foreach(Column col in Columns)
                {
                    if (col.IsOriginal)
                    {
                        return true;
                    }
                }
                return false;
            }
        }

        internal string ToHTML(Options options)
        {
            StringBuilder table = new StringBuilder();
            table.AppendLine();
            table.AppendFormat("<h1>{0}</h1>", Name);
            table.AppendFormat("<p>{0}</p>", Description);
            if (!IsOriginal)
            {
                table.Append("<p><i>This is an extension table.</i></p>");
            }
            table.AppendLine("<table cellpadding=\"2\">");
            table.AppendLine("<tr><th style=\"width:10em\">Field Name</th><th style=\"width:5em\">Type (Format)</th><th style=\"width:15em\">Source</th><th>Description</th><th style=\"width:10em\">Allowed Values</th><th style=\"width:5em\">Required?</th><th style=\"width:5em\">Unique?</th></tr>");
            table.AppendLine();
            foreach (Column column in Columns)
            {
                if (column.IsHidden || (column.IsDeprecated && options.IncludeDeprecated != 1))
                {
                    continue;
                }
                string source = "Open Referral field excluded from application profile";
                if (column.Source == "lga")
                {
                    source = "Extension for LGA";
                }
                else if (column.Source == "openReferral")
                {
                    source = "Open Referral field used in application profile";
                }
                List<string> allowedValuesList = new List<string>();
                if (column.Schemas != null && column.Schemas.Length > 0)
                {
                    foreach (SchemaURI schema in column.Schemas)
                    {
                        allowedValuesList.Add(schema.ToString());
                    }
                }

                if (column.Enum != null)
                {
                    allowedValuesList.AddRange(column.Enum);
                }

                string allowedValues = "-";
                if (allowedValuesList.Count > 0)
                {                    
                    allowedValues = "<ul><li>" + string.Join("</li><li>", allowedValuesList) + "</li></ul>";
                }

                string format = column.Type;
                if (!string.IsNullOrEmpty(column.Format))
                {
                    format += " (" + column.Format + ")";
                }
                table.AppendFormat("<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>", column.Name, format, source, FormatHTML(column.Description), allowedValues, column.Required, column.Unique);
            }
            table.AppendLine("</table>");

            return table.ToString();
        }

        private string FormatHTML(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return value;
            }
            return value.Replace("\r\n", "<br/>");
        }

        internal string ToGV(Options options)
        {
            StringBuilder table = new StringBuilder();
            table.AppendLine();
            table.AppendLine(string.Format("{0} [label=<", Name));
            table.AppendLine("<table border=\"0\" cellborder=\"1\" cellspacing=\"0\" cellpadding=\"4\">");
            table.AppendLine(string.Format("<tr><td bgcolor=\"{0}\"><b>{1}</b></td></tr>", Utility.GetSourceColour(ApplicationProfile, "lightgrey"), Name));

            HashSet<string> hidden = new HashSet<string>();
            foreach(Column column in Columns)
            {                
                if (column.IsHidden || (column.IsDeprecated && options.IncludeDeprecated != 1))
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

        internal string ToSQL(Options options)
        {
            StringBuilder sql = new StringBuilder();
            sql.Append("CREATE TABLE ");
            sql.Append(Name);
            sql.Append(" (");
            sql.AppendLine();

            HashSet<string> hidden = new HashSet<string>();
            HashSet<string> unique = new HashSet<string>();
            int count = 0;
            foreach (Column column in Columns)
            {
                count++;
                if (column.IsHidden || (column.IsDeprecated && options.IncludeDeprecated != 1))
                {
                    hidden.Add(column.Name);
                    continue;
                }

                if (column.Unique)
                {
                    unique.Add(column.Name);
                }

                sql.Append(column.ToSQL(options));
                if (count != Columns.Count)
                {
                    sql.Append(",");
                    sql.AppendLine();
                }
            }

            AddPrimaryKeys(sql);

            if (ForeignKeys != null)
            {
                AddForeignKeys(sql, hidden);
            }

            AddUniqueConstraints(sql, unique);

            sql.AppendLine();
            sql.AppendLine(");");

            return sql.ToString();
        }

        private void AddPrimaryKeys(StringBuilder sql)
        {
            if (!string.IsNullOrEmpty(PrimaryKey))
            {
                sql.Append(",");
                sql.AppendLine();
                sql.Append(string.Format("CONSTRAINT PK_{0} PRIMARY KEY ({1})", Name, PrimaryKey));
            }
        }

        private void AddUniqueConstraints(StringBuilder sql, HashSet<string> unique)
        {
            int index = 0;
            foreach (string u in unique)
            {
                if (u == PrimaryKey)
                {
                    continue;
                }
                index++;
                sql.Append(",");
                sql.AppendLine();
                sql.Append(string.Format("CONSTRAINT UC_{0}_{1} UNIQUE ({2})", Name, index, u));
            }
        }

        private void AddForeignKeys(StringBuilder sql, HashSet<string> hidden)
        {
            int index = 0;
            foreach (ForeignKeyReference foreignKey in ForeignKeys)
            {
                if (hidden.Contains(foreignKey.TableField))
                {
                    continue;
                }
                index++;
                sql.Append(",");
                sql.AppendLine();
                sql.Append(foreignKey.ToSQL(PrimaryKey, index));
            }
        }
    }
}

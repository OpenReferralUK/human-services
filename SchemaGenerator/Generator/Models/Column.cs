using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor.Models
{
    public class Column
    {
        internal Column(string name, string type, dynamic original, dynamic source, dynamic format, dynamic description, dynamic hidden, dynamic deprecated, bool isKey, bool required, bool unique, string[] enumValues, dynamic schemes)
        {
            this.Name = name;
            this.Type = type;
            this.Source = string.Empty;
            if (source != null)
            {
                this.Source = source.Value;
            }
            if (format != null)
            {
                this.Format = format.Value;
            }
            if (description != null)
            {
                this.Description = description.Value;
            }
            if (hidden != null)
            {
                this.IsHidden = hidden.Value;
            }
            if (original != null)
            {
                this.IsOriginal = original.Value;
            }
            if (deprecated != null)
            {
                this.IsDeprecated = deprecated.Value;
            }
            if (schemes != null)
            {
                List<SchemaURI> schemaUris = new List<SchemaURI>();
                foreach (dynamic item in schemes)
                {
                    schemaUris.Add(new SchemaURI() { name = item.name, required = item.required, uri = item.uri });
                }
                Schemas = schemaUris.ToArray();
            }
            this.IsKey = isKey;
            this.Required = required;
            this.Unique = unique;
            this.Enum = enumValues;
        }

        internal bool IsOriginal
        {
            get;
            private set;
        }

        internal bool IsHidden
        {
            get;
            private set;
        }

        internal bool IsDeprecated
        {
            get;
            private set;
        }

        internal string Name
        {
            get;
            private set;
        }

        internal string Type
        {
            get;
            private set;
        }

        internal string Source
        {
            get;
            private set;
        }

        internal string Description
        {
            get;
            private set;
        }

        internal string Format
        {
            get;
            private set;
        }

        internal bool IsKey
        {
            get;
            private set;
        }

        internal bool Required
        {
            get;
            private set;
        }

        internal bool Unique
        {
            get;
            private set;
        }

        internal string[] Enum
        {
            get;
            private set;
        }

        internal SchemaURI[] Schemas
        {
            get;
            private set;
        }

        internal string ToGV()
        {
            string attributes = string.Empty;
            if (IsKey)
            {
                attributes += string.Format("port='{0}' ", Name);
            }
            attributes += string.Format(" bgcolor=\"{0}\"", Utility.GetSourceColour(Source, "white"));
            return string.Format("<tr><td {1}><b>{0}</b></td></tr>", Name, attributes);
        }

        internal string ToSQL(Options options)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(LeftEscape(options));
            sb.Append(Name);
            sb.Append(RightEscape(options));
            sb.Append(" ");
            sb.Append(TypeToSQLType(Type, IsKey, options));
            if (Required)
            {
                sb.Append(" NOT NULL");
            }
            return sb.ToString();
        }

        private string LeftEscape(Options options)
        {
            if (options.Engine == 1)
            {
                return "`";
            }
            return "[";
        }

        private string RightEscape(Options options)
        {
            if (options.Engine == 1)
            {
                return "`";
            }
            return "]";
        }

        internal string TypeToSQLType(string type, bool isKey, Options options)
        {
            if (type == "string")
            {
                if (isKey)
                {
                    return "varchar(1536)";
                }
                if (options.Engine == 1)
                {
                    return "text";
                }
                return "varchar(65535)";
            }
            if (type == "number")
            {
                return "double";
            }
            if (type == "date")
            {
                return "datetime";
            }
            return type;
        }
    }
}

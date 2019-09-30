using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor.Models
{
    public class Column
    {
        internal Column(string name, string type, dynamic numberType, bool original, dynamic source, dynamic applicationProfile, dynamic format, dynamic description, dynamic hidden, dynamic deprecated, bool isKey, bool required, bool unique, string[] enumValues)
        {
            this.Name = name;
            this.Type = type;
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
                        this.Description += "\r\n\r\n";
                    }
                    this.Description += "Application Profile Notes: ";
                    this.Description += applicationProfile.notes;
                }
                if (applicationProfile.schemes != null)
                {
                    List<SchemaURI> schemaUris = new List<SchemaURI>();
                    foreach (dynamic item in applicationProfile.schemes)
                    {
                        schemaUris.Add(new SchemaURI() { name = item.name, required = item.required, uri = item.uri });
                    }
                    Schemas = schemaUris.ToArray();
                }
            }            
            if (format != null)
            {
                this.Format = format.Value;
            }
            if (hidden != null)
            {
                this.IsHidden = hidden.Value;
            }
            if (deprecated != null)
            {
                this.IsDeprecated = deprecated.Value;
            }
            if (numberType != null)
            {
                this.NumberType = numberType.Value;
            }
            this.IsOriginal = original;
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

        internal string NumberType
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
            attributes += string.Format(" bgcolor=\"{0}\"", Utility.GetSourceColour(ApplicationProfile, "white"));
            return string.Format("<tr><td {1}><b>{0}</b></td></tr>", Name, attributes);
        }

        internal string ToSQL(Options options)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(Utility.LeftEscape(options));
            sb.Append(Name);
            sb.Append(Utility.RightEscape(options));
            sb.Append(" ");
            sb.Append(TypeToSQLType(Type, NumberType, IsKey, options));
            if (Required)
            {
                sb.Append(" NOT NULL");
            }
            return sb.ToString();
        }

        internal string TypeToSQLType(string type, string numberType, bool isKey, Options options)
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
                return numberType;
            }
            if (type == "date")
            {
                return "datetime";
            }
            return type;
        }
    }
}

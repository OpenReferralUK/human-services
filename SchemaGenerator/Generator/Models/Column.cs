using Generator.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor.Models
{
    public class Column
    {
        internal Column(string name, string type, dynamic numberType, dynamic geoType, bool original, dynamic source, dynamic applicationProfile, dynamic format, dynamic description, dynamic hidden, dynamic deprecated, bool isPrimaryKey, bool isForiegnKey, bool required, bool unique, string[] enumValues, Options options)
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
                ApplicationProfiles = Profile.Create(applicationProfile);
                Profile profile = Profile.GetProfile(ApplicationProfiles, options);

                if (profile != null && profile.Notes != null)
                {
                    if (!string.IsNullOrEmpty(this.Description))
                    {
                        this.Description += "\r\n\r\n";
                    }
                    this.Description += "Application Profile Notes: ";
                    this.Description += profile.Notes;
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
            if (geoType != null)
            {
                this.GeoType = geoType.Value;
            }
            this.IsOriginal = original;
            this.IsPrimaryKey = isPrimaryKey;
            this.IsForeignKey = isForiegnKey;
            this.IsKey = isPrimaryKey || isForiegnKey;
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

        internal string GeoType
        {
            get;
            private set;
        }

        internal string Source
        {
            get;
            private set;
        }

        internal Profile[] ApplicationProfiles
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

        internal bool IsPrimaryKey
        {
            get;
            private set;
        }

        internal bool IsForeignKey
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

        internal string ToGV(Options options)
        {
            string attributes = string.Empty;
            if (IsKey)
            {
                attributes += string.Format("port='{0}' ", Name);
            }
            string chartName = Name;
            Profile profile = Profile.GetProfile(ApplicationProfiles, options);
            if (profile != null && !string.IsNullOrEmpty(profile.Moscow))
            {
                chartName += " (" + profile.Moscow + ")";
            }
            attributes += string.Format(" bgcolor=\"{0}\"", Utility.GetSourceColour(Source, "white"));
            return string.Format("<tr><td {1}><b>{0}</b></td></tr>", chartName, attributes);
        }

        internal string ToSQL(Options options)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(Utility.LeftEscape(options));
            sb.Append(Name);
            sb.Append(Utility.RightEscape(options));
            sb.Append(" ");
            sb.Append(TypeToSQLType(options));
            if (Required)
            {
                sb.Append(" NOT NULL");
            }
            return sb.ToString();
        }

        internal string TypeToSQLType(Options options)
        {
            string sqlType = TypeToDataType(options);
            string charLength = TypeToCharMaximumLength(options);
            if (!string.IsNullOrEmpty(charLength))
            {
                sqlType += "(";
                sqlType += charLength;
                sqlType += ")";
            }
            return sqlType;
        }

        internal string TypeToDataType(Options options)
        {
            if (Type == "string")
            {
                if (IsKey)
                {
                    return "varchar";
                }
                if (options.Engine == 1)
                {
                    if (!string.IsNullOrEmpty(GeoType))
                    {
                        return GeoType;
                    }
                    return "text";
                }
                return "varchar";
            }
            if (Type == "number")
            {
                return NumberType;
            }
            if (Type == "date")
            {
                return "datetime";
            }
            return Type;
        }

        internal string TypeToCharMaximumLength(Options options)
        {
            if (Type == "string")
            {
                if (IsKey)
                {
                    return "1536";
                }
                return "65535";
            }
            return string.Empty;
        }
    }
}

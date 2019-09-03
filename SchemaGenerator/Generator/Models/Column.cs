using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor.Models
{
    public class Column
    {
        internal Column(string name, string type, dynamic source, dynamic format, dynamic description, dynamic hidden, bool isKey, bool required, bool unique, string[] enumValues)
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
            this.IsKey = isKey;
            this.Required = required;
            this.Unique = unique;
            this.Enum = enumValues;
        }

        internal bool IsHidden
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
    }
}

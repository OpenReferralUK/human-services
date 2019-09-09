using System;

namespace Convertor.Models
{
    public class SchemaURI
    {
        public string name;
        public string uri;
        public string required;

        public override string ToString()
        {
            if (Convert.ToBoolean(required))
            {
                return string.Format("at least one reference to {0}", uri);
            }
            return string.Format("zero to many references to {0}", uri);
        }
    }
}

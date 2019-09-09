using Newtonsoft.Json;

namespace Convertor.Models
{
    public class JSONTableField
    {
        public string name;
        public string type;
        public string description;
        public string format;
        [JsonProperty(PropertyName = "enum")]
        public string[] enumValue;
        public JSONSchemaConstraint constraints;        

        public JSONTableField(Column column)
        {
            name = column.Name;
            type = column.Type;
            format = column.Format;
            description = column.Description;
            enumValue = column.Enum;
            constraints = new JSONSchemaConstraint();
            constraints.required = column.Required;
            constraints.unique = column.Unique;
        }
    }
}

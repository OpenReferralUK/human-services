using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data.Entity.Design.PluralizationServices;
using System.Globalization;
using System.IO;

namespace Convertor.Models
{
    public class JSONSchema
    {
        private List<Table> tables;
        private PluralizationService pluralization;
        private string reference;

        public JSONSchema(List<Table> tables)
        {
            this.tables = tables;
        }

        public JSONProperty GetStructure(Options options)
        {
            this.reference = options.ReferenceTable;
            pluralization = PluralizationService.CreateService(CultureInfo.GetCultureInfo("en"));
            Table table = null;

            foreach (Table t in tables)
            {
                if (t.Name == reference)
                {
                    table = t;
                    break;
                }
            }

            JSONProperty property = ProcessTables(table, new JSONProperty() { type = "object", title = reference, schema = "http://json-schema.org/draft-07/schema#" }, new HashSet<string>(), options.Verbose == 1);
            if (options.Multiple == 1)
            {
                JSONProperty array = new JSONProperty();
                array.type = "array";
                array.title = property.title;
                array.schema = property.schema;
                property.title = null;
                property.schema = null;
                array.items = property;
                return array;
            }
            return property;
        }

        public void Generate(string filename, Options options)
        {
            if (string.IsNullOrEmpty(filename))
            {
                filename = "schema.json";
            }
            else
            {
                filename += ".json";
            }

            string json = JsonConvert.SerializeObject(GetStructure(options), new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            File.WriteAllText(filename, json);
        }

        private JSONProperty ProcessTables(Table table, JSONProperty props, HashSet<string> previousTables, bool followExternalReferences = true)
        {
            List<string> requires = new List<string>();
            foreach (Column field in table.Columns)
            {
                Table refTable = null;
                foreach (ForeignKeyReference foreignKey in table.ForeignKeys)
                {
                    if (field.Name == foreignKey.TableField)
                    {
                        foreach (Table t in tables)
                        {
                            if (t.Name == foreignKey.ReferenceTableName)
                            {
                                refTable = t;
                                break;
                            }
                        }
                    }
                }
                
                if (refTable != null && previousTables.Contains(refTable.Name))
                {
                    //do not include fields that are in fact thier parents
                    continue;
                }

                if (refTable == null && field.Required)
                {
                    requires.Add(field.Name);
                }

                if (refTable != null)
                {
                    JSONProperty prop = new JSONProperty() { properties = new Dictionary<string, JSONProperty>() };
                    prop.SetType("object");
                    prop = ProcessTables(refTable, prop, previousTables, followExternalReferences);
                    AddProperty(props, refTable.Name, prop);
                    if (field.Required)
                    {
                        requires.Add(refTable.Name);
                    }
                }
                else if (!field.IsHidden)
                {
                    JSONProperty prop = new JSONProperty();
                    prop.SetType(field.Type);
                    prop.SetFormat(field.Format);
                    if (field.Enum != null)
                    {
                        prop.enumValues = new List<string>(field.Enum);
                    }
                    if (!string.IsNullOrEmpty(field.Description))
                    {
                        prop.description = field.Description;
                    }
                    AddProperty(props, field.Name, prop);
                }
            }

            if (requires.Count > 0)
            {
                props.required = requires;
            }

            if (followExternalReferences && (string.IsNullOrEmpty(reference) || table.Name == reference))
            {
                previousTables.Add(table.Name);

                foreach (Table t in tables)
                {
                    if (t.Name == table.Name)
                    {
                        continue;
                    }

                    foreach (ForeignKeyReference foreignKey in t.ForeignKeys)
                    {
                        if (foreignKey.ReferenceTableName == table.Name)
                        {
                            JSONProperty prop = new JSONProperty() { items = new JSONProperty() { properties = new Dictionary<string, JSONProperty>() } };
                            prop.SetType("array");
                            prop.items.SetType("object");
                            prop.items = ProcessTables(t, prop.items, previousTables, false);
                            AddProperty(props, Pluralize(t.Name), prop);
                        }
                    }
                }
            }

            return props;
        }

        private string Pluralize(string name)
        {
            string[] parts = name.Split('_');

            if (parts.Length <= 1)
            {
                return pluralization.Pluralize(name);
            }

            parts[parts.Length - 1] = pluralization.Pluralize(parts[parts.Length - 1]);

            return string.Join("_", parts);
        }

        private void AddProperty(JSONProperty props, string name, JSONProperty prop)
        {
            if (props.properties == null)
            {
                props.properties = new Dictionary<string, JSONProperty>();
            }
            props.properties.Add(name, prop);
        }
    }
}

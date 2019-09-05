using Generator;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using System.Threading;

namespace Convertor.Models
{
    public class CSVSchema
    {
        private List<Table> tables;
        private List<CSVSchemaRow> rows = new List<CSVSchemaRow>();
        private Dictionary<string, int> tableCount = new Dictionary<string, int>();
        private Dictionary<string, int> tableColumnCount = new Dictionary<string, int>();

        public CSVSchema(List<Table> tables)
        {
            this.tables = tables;
        }

        public void Generate(Options options)
        {
            JSONSchema schema = new JSONSchema(tables);
            JSONProperty property = schema.GetStructure(options);
            Parse(property, string.Empty, new List<string>(), new List<string>(), false, true);
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("SchemaIdentifier,SchemaMajorVersion,SchemaMajorVersionDate,SchemaLabel,SchemaDescription,SchemaTemplateId,SchemaMinorVersions,SchemaMinorVersionDates,SchemaMinorVersionDescriptions,SchemaRequirementIdentifier,SchemaRequirementOrder,SchemaRequirementLabel,SchemaRequirementMandatory,SchemaRequirementDescription,SchemaRequirementMinOccurances,SchemaRequirementMaxOccurances,SchemaRequirementNote,SchemaRequirementFieldIdentifier,SchemaRequirementFieldOrder,SchemaRequirementFieldDescription,SchemaRequirementFieldMandatory,SchemaRequirementFieldMinOccurances,SchemaRequirementFieldMaxOccurances,SchemaRequirementFieldHelp,FieldIdentifier,FieldLabel,FieldType,FieldDescription,FieldPattern,FieldURIStubs");
            foreach (CSVSchemaRow row in rows)
            {
                sb.AppendLine(row.ToString());
            }

            File.WriteAllText(FileUtility.CreatePath(options, "schema.csv", ".csv"), sb.ToString());
        }

        private string FirstLetterToUpper(string str)
        {
            if (str == null)
                return null;

            if (str.Length > 1)
                return char.ToUpper(str[0]) + str.Substring(1);

            return str.ToUpper();
        }

        private string GetFieldName(List<string> tableNames, string name)
        {
            if (tableNames.Count == 1)
            {
                return name;
            }

            string final = string.Empty;
            for(int i = 1; i < tableNames.Count;i++)
            {
                if (!string.IsNullOrEmpty(final))
                {
                    final += "_";
                }
                final += tableNames[i];
            }

            return final + "_" + name;
        }

        private string GetRequirementLabel(string identifier)
        {
            identifier = identifier.Replace("_", " ");
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            TextInfo textInfo = cultureInfo.TextInfo;
            return textInfo.ToTitleCase(identifier);
        }

        private string GetRequirementIdentifier(List<string> tableNames)
        {
            if (tableNames.Count == 1)
            {
                return tableNames[0];
            }

            string final = string.Empty;
            for (int i = 1; i < tableNames.Count; i++)
            {
                if (!string.IsNullOrEmpty(final))
                {
                    final += "_";
                }
                final += tableNames[i];
            }

            return final;
        }

        private void Parse(JSONProperty property, string parentPropertyName, List<string> tableNames, List<string> required, bool multiple, bool tableMandatory)
        {
            if (property == null)
            {
                return;
            }

            if (!string.IsNullOrEmpty(property.title))
            {
                parentPropertyName += property.title;
                tableNames.Add(property.title);
            }

            foreach (KeyValuePair<string, JSONProperty> kvp in property.properties)
            {
                if (kvp.Value.type == "object")
                {
                    List<string> tNames = new List<string>(tableNames);
                    tNames.Add(kvp.Key);
                    Parse(kvp.Value, parentPropertyName + "_" + kvp.Key, tNames, kvp.Value.required, multiple, tableMandatory);
                }
                else if (kvp.Value.type == "array")
                {
                    List<string> tNames = new List<string>(tableNames);
                    tNames.Add(kvp.Key);
                    Parse(kvp.Value.items, parentPropertyName + "_" + kvp.Key, tNames, kvp.Value.items.required, true, false);
                }
                else
                {
                    bool mandatory = false;
                    int minOccurances = 0;
                    int maxOccurances = 1;
                    string fieldType = kvp.Value.type;
                    string fieldPattern = kvp.Value.pattern;

                    if (required.Contains(kvp.Key))
                    {
                        mandatory = true;
                        minOccurances = 1;
                    }

                    if (multiple)
                    {
                        maxOccurances = 99;
                    }

                    if (kvp.Value.enumValues != null && kvp.Value.enumValues.Count > 0)
                    {
                        fieldType = "EncodedList";
                        fieldPattern = string.Format("({0})", string.Join("|", kvp.Value.enumValues));
                    }

                    if (kvp.Value.format == "uri")
                    {
                        fieldType = "URI";
                    }
                    else if (kvp.Value.format == "date")
                    {
                        fieldType = "Date";
                    }

                    int sort = 0;
                    if (!tableCount.ContainsKey(parentPropertyName))
                    {
                        sort = (tableCount.Count + 1) * 1000;
                        tableCount.Add(parentPropertyName, tableCount.Count+1);
                    }
                    else
                    {
                        sort = tableCount[parentPropertyName] * 1000;
                    }

                    if (!tableColumnCount.ContainsKey(parentPropertyName))
                    {
                        tableColumnCount.Add(parentPropertyName, 1);
                        sort += 1;
                    }
                    else
                    {
                        sort += tableColumnCount[parentPropertyName] = tableColumnCount[parentPropertyName] + 1;
                    }

                    fieldType = FirstLetterToUpper(fieldType);

                    rows.Add(new CSVSchemaRow()
                    {
                        SchemaRequirementIdentifier = GetRequirementIdentifier(tableNames),
                        SchemaRequirementLabel = GetRequirementLabel(GetRequirementIdentifier(tableNames)),
                        SchemaRequirementOrder = tableCount[parentPropertyName].ToString(),
                        SchemaRequirementMandatory = tableMandatory.ToString(),
                        FieldIdentifier = GetFieldName(tableNames, kvp.Key),
                        FieldLabel = kvp.Key,
                        SchemaRequirementFieldIdentifier = kvp.Key,
                        FieldType = fieldType,
                        FieldDescription = kvp.Value.description,
                        FieldPattern = fieldPattern,
                        SchemaRequirementFieldMandatory = mandatory.ToString(),
                        SchemaRequirementFieldMinOccurances = minOccurances.ToString(),
                        SchemaRequirementFieldMaxOccurances = maxOccurances.ToString(),
                        SchemaRequirementFieldDescription = kvp.Value.description,
                        SchemaRequirementFieldOrder = tableColumnCount[parentPropertyName].ToString(),
                        SchemaRequirementMinOccurances = minOccurances.ToString(),
                        SchemaRequirementMaxOccurances = maxOccurances.ToString(),
                        Sort = sort
                    });

                    rows.Sort();
                }
            }
        }
    }
}

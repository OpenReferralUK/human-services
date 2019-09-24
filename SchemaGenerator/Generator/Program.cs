using CommandLine;
using Convertor.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Convertor
{
    class Program
    {
        static void Main(string[] args)
        {
            Options options = new Options();
            ParserResult<Options> result = Parser.Default.ParseArguments<Options>(args).WithParsed<Options>(o =>
            {
                options = o;
            });

            if (result.Tag == ParserResultType.NotParsed)
            {
                // Help text requested, or parsing failed. Exit.
                return;
            }

            List<Table> tables = FilterJSON(options);

            if (options.ExportType == "gv")
            {
                ERD erd = new ERD(tables);
                erd.Generate(options);
            }
            else if (options.ExportType == "json")
            {
                JSONSchema schema = new JSONSchema(tables);
                schema.Generate(options);
            }
            else if (options.ExportType == "table")
            {
                JSONTable schema = new JSONTable(tables);
                schema.Generate(options);
            }
            else if (options.ExportType == "csv")
            {
                CSVSchema schema = new CSVSchema(tables);
                schema.Generate(options);
            }
            else if (options.ExportType == "sql")
            {
                SQL sql = new SQL(tables);
                sql.Generate(options);
            }
            else if (options.ExportType == "html")
            {
                HTML html = new HTML(tables);
                html.Generate(options);
            }
            else
            {
                Console.WriteLine("Export type not recognised");
            }
        }

        private static List<Table> FilterJSON(Options options)
        {
            List<Table> tables = new List<Table>();
            HashSet<string> excludedColumns = new HashSet<string>();

            dynamic dataPackage = JObject.Parse(File.ReadAllText("ExtendedDataPackage.json"));
            if (dataPackage != null && dataPackage.resources != null)
            {
                foreach (dynamic resource in dataPackage.resources)
                {
                    if (resource.schema == null)
                    {
                        continue;
                    }

                    HashSet<string> keys = new HashSet<string>();
                    keys.Add(resource.schema.primaryKey.Value);

                    if (resource.schema.foreignKeys != null)
                    {
                        foreach (dynamic foreignKey in resource.schema.foreignKeys)
                        {
                            if (!keys.Contains(foreignKey.fields.Value))
                            {
                                keys.Add(foreignKey.fields.Value);
                            }
                        }
                    }

                    int matchingColumns = 0;
                    Table table = new Table(resource.name.Value, resource.description, resource.source, resource.applicationProfile, resource.schema.primaryKey);
                    if (resource.schema.fields != null)
                    {
                        foreach (dynamic field in resource.schema.fields)
                        {
                            if (!IsValid(options.Filter, field.source, field.applicationProfile))
                            {
                                excludedColumns.Add(string.Format("{0}.{1}", resource.name, field.name));
                                continue;
                            }
                            matchingColumns++;
                            bool required = false;
                            bool unique = false;
                            string[] enumValues = null;
                            if (field.constraints != null)
                            {
                                if (field.constraints.required != null)
                                {
                                    required = field.constraints.required.Value;
                                }
                                if (field.constraints.unique != null)
                                {
                                    unique = field.constraints.unique.Value;
                                }
                            }
                            if (field.constraints != null && field.constraints["enum"] != null)
                            {
                                enumValues = field.constraints["enum"].ToObject<string[]>();
                            }
                            table.Columns.Add(new Column(field.name.Value, field.type.Value, field.number_type, (field.source == "openReferral"), field.source, field.applicationProfile, field.format, field.description, field.hidden, field.deprecated, keys.Contains(field.name.Value), required, unique, enumValues));
                        }
                    }

                    if (matchingColumns > 0)
                    {
                        if (resource.schema.foreignKeys != null)
                        {
                            foreach (dynamic foreignKey in resource.schema.foreignKeys)
                            {
                                table.ForeignKeys.Add(new ForeignKeyReference(resource.name.Value, foreignKey.fields.Value, foreignKey.reference.resource.Value, foreignKey.reference.fields.Value));
                            }
                        }
                    }

                    tables.Add(table);
                }
            }

            List<Table> results = new List<Table>();

            foreach (Table table in tables)
            {
                if (table.Columns.Count == 0)
                {
                    continue;
                }

                List<ForeignKeyReference> keys = new List<ForeignKeyReference>();
                foreach (ForeignKeyReference foriegnKey in table.ForeignKeys)
                {
                    if (!excludedColumns.Contains(string.Format("{0}.{1}", foriegnKey.TableName, foriegnKey.TableField)) &&
                        !excludedColumns.Contains(string.Format("{0}.{1}", foriegnKey.ReferenceTableName, foriegnKey.ReferenceTableField)))
                    {
                        keys.Add(foriegnKey);
                    }
                }

                table.ForeignKeys = keys;
                results.Add(table);
            }

            return results;
        }

        private static bool IsValid(int filter, dynamic source, dynamic applicationProfile)
        {
            if (filter == 0)
            {
                return true;
            }
            if (filter == 1)
            {
                return (source != null) && source.Value == "openReferral";
            }
            if (filter == 2)
            {
                return (applicationProfile != null);
            }
            return true;
        }
    }
}

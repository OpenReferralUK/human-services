using MySql.Data.MySqlClient;
using ServiceDirectory.Common;
using ServiceDirectory.Common.DataStandard;
using System;
using System.Collections.Generic;

namespace Combiner
{
    class Program
    {
        private const string ID_COLUMN = "`id`";
        private const string QUOTATION = "\"";
        private const string COLUMN_ESCAPE = "`";

        static void Main(string[] args)
        {
            List<string> baseUrls = new List<string>();
            baseUrls.Add("https://api.porism.com/ServiceDirectoryService");
            baseUrls.Add("https://api.porism.com/ServiceDirectoryServiceBlackburn");
            baseUrls.Add("https://api.porism.com/ServiceDirectoryServiceNYorks");
            baseUrls.Add("https://api.porism.com/ServiceDirectoryServiceCQC");

            ResourceReader resourceReader = new ResourceReader(); 
            dynamic resources = resourceReader.GetResources().GetAwaiter().GetResult();
            List<string> resourceNames = resourceReader.GetResourceNames().GetAwaiter().GetResult();            

            using (MySqlConnection conn = new MySqlConnection("Server=informplus-beta.rds.esd.org.uk;Port=3306;Database=ServiceDirectoryCombined;Uid=awsuserbeta;Pwd=pQr1$m"))
            {
                conn.Open();
                ClearDatabase(conn);
                foreach (string baseUrl in baseUrls)
                {
                    Dictionary<string, Dictionary<string, string>> keyReWrite = new Dictionary<string, Dictionary<string, string>>();
                    Dictionary<string, Dictionary<string, dynamic>> objectCollection = Delayering.DelayerPaginatedData(baseUrl).GetAwaiter().GetResult();                    
                    List<Row> rows = new List<Row>();
                    foreach (KeyValuePair<string, Dictionary<string, dynamic>> kvp in objectCollection)
                    {
                        dynamic resource = GetResource(resources, kvp.Key);
                        string resourceName = Resources.FindResourceName(kvp.Key, resourceNames);
                        foreach (KeyValuePair<string, dynamic> vals in kvp.Value)
                        {
                            if (resource == null)
                            {
                                continue;
                            }

                            Row row = new Row(resourceName);
                            foreach (KeyValuePair<string, dynamic> fieldKvp in vals.Value)
                            {
                                string columnName = fieldKvp.Key.ToLower();
                                if (fieldKvp.Value == null || !ResourceFieldExists(resource, columnName))
                                {
                                    continue;
                                }
                                row.Fields.Add(COLUMN_ESCAPE + columnName + COLUMN_ESCAPE);
                                if (fieldKvp.Value is String)
                                {
                                    row.Values.Add(QUOTATION + fieldKvp.Value + QUOTATION);
                                    continue;
                                }
                                if (fieldKvp.Value.Type == Newtonsoft.Json.Linq.JTokenType.String || fieldKvp.Value.Type == Newtonsoft.Json.Linq.JTokenType.Date)
                                {
                                    row.Values.Add(QUOTATION + MySqlHelper.EscapeString(Convert.ToString(fieldKvp.Value.Value)) + QUOTATION);
                                    continue;
                                }
                                row.Values.Add(Convert.ToString(fieldKvp.Value));
                            }

                            if (!row.Fields.Contains(ID_COLUMN))
                            {
                                row.Fields.Add(ID_COLUMN);
                                row.Values.Add(QUOTATION + Guid.NewGuid().ToString() + QUOTATION);
                            }
                            else
                            {
                                int index = row.Fields.IndexOf(ID_COLUMN);
                                if (index > -1 && resourceName != "service" && resourceName != "organization" && resourceName != "location")
                                {
                                    if (!keyReWrite.ContainsKey(resourceName))
                                    {
                                        keyReWrite.Add(resourceName, new Dictionary<string, string>());
                                    }
                                    string originalKey = row.Values[index].Replace(QUOTATION, string.Empty);
                                    if (!keyReWrite[resourceName].ContainsKey(originalKey))
                                    {
                                        keyReWrite[resourceName].Add(originalKey, Guid.NewGuid().ToString());
                                    }
                                    row.Values[index] = QUOTATION + keyReWrite[resourceName][originalKey] + QUOTATION;
                                }
                            }
                            rows.Add(row);
                        }
                    }

                    List<Row> retryCommands;

                    do
                    {
                        retryCommands = new List<Row>();

                        try
                        {
                            RunSQL("SET FOREIGN_KEY_CHECKS=0;", conn);
                            foreach (Row row in rows)
                            {
                                try
                                {
                                    RunSQL(row.ToSQL(keyReWrite), conn);
                                }
                                catch (Exception e)
                                {
                                    retryCommands.Add(row);
                                    if (!e.Message.StartsWith("Cannot add or update a child row: a foreign key constraint fails"))
                                    {
                                        Console.WriteLine(e.Message);
                                    }
                                }
                            }
                        }
                        finally
                        {
                            try
                            {
                                RunSQL("SET FOREIGN_KEY_CHECKS=1;", conn);
                            }
                            catch(Exception e)
                            {
                                Console.WriteLine("Unable to save due to inconsistent data: " + e.Message);
                                Console.ReadKey();
                            }
                        }
                        rows = retryCommands;
                    }
                    while (retryCommands.Count > 0);
                }
            }
        }

        private static void RunSQL(string sql, MySqlConnection conn)
        {
            using (MySqlCommand mysqlCommand = new MySqlCommand(sql, conn))
            {
                mysqlCommand.ExecuteNonQuery();
            }
        }

        private static dynamic GetResource(dynamic resources, string name)
        {
            foreach (dynamic resource in resources)
            {
                if (resource.name.Value == name)
                {
                    return resource;
                }
            }
            return null;
        }

        private static bool IsVisible(dynamic item)
        {
            if (item.applicationProfile == null)
            {
                return false;
            }
            foreach (dynamic profile in item.applicationProfile)
            {
                if (profile.name == "LGA" || profile.name == "openReferral")
                {
                    return true;
                }
            }
            return false;
        }

        private static bool ResourceFieldExists(dynamic resource, string name)
        {
            foreach (dynamic field in resource.schema.fields)
            {
                if (field.name.Value == name)
                {
                    return IsVisible(field);
                }
            }
            return false;
        }

        private static void ClearDatabase(MySqlConnection conn)
        {
            Queue<string> tableNames = new Queue<string>();
            using (MySqlCommand command = new MySqlCommand("show tables from ServiceDirectoryCombined", conn))
            {
                using (MySqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string table = reader.GetString(0);
                        if (table.StartsWith("esd_"))
                        {
                            continue;
                        }
                        tableNames.Enqueue(table);
                    }
                }
            }
            while(tableNames.Count > 0)
            {
                string table = tableNames.Dequeue();
                try
                {
                    using (MySqlCommand command = new MySqlCommand(string.Format("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE `{0}`; SET FOREIGN_KEY_CHECKS = 1;", table), conn))
                    {
                        command.ExecuteNonQuery();
                    }
                }
                catch (Exception e)
                {
                    tableNames.Enqueue(table);
                }
            }
        }
    }
}

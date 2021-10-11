﻿using MySql.Data.MySqlClient;
using ServiceDirectory.Common;
using ServiceDirectory.Common.DataStandard;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Configuration;

namespace Combiner
{
    class Program
    {
        private const string ID_COLUMN = "`id`";
        private const string QUOTATION = "\"";
        private const string COLUMN_ESCAPE = "`";
        private const string NULL = "null";

        static void Main(string[] args)
        {
            MultipleBaseURLsSection section = (MultipleBaseURLsSection)ConfigurationManager.GetSection("EndPoints");
            List<BaseURLElement> baseUrls = (from object value in section.Values
                                select ((BaseURLElement)value))
                                .ToList();

            ResourceReader resourceReader = new ResourceReader(); 
            dynamic resources = resourceReader.GetResources().GetAwaiter().GetResult();
            List<string> resourceNames = resourceReader.GetResourceNames().GetAwaiter().GetResult();
            HashDatabase hashDatabase = new HashDatabase();
            hashDatabase.Load();

            using (MySqlConnection conn = new MySqlConnection("Server=informplus-beta.rds.esd.org.uk;Port=3306;Database=ServiceDirectoryCombined;Uid=awsuserbeta;Pwd=pQr1$m"))
            {
                conn.Open();
                ClearDatabase(conn);
            }

            foreach (BaseURLElement baseUrl in baseUrls)
            {
                Dictionary<string, Dictionary<string, string>> keyReWrite = new Dictionary<string, Dictionary<string, string>>();
                DelayeredResult delayeredResult = Delayering.DelayerPaginatedData(baseUrl.URL).GetAwaiter().GetResult();

                if (!HasUpdated(delayeredResult, hashDatabase.Get(baseUrl.URL)))
                {
                    Console.WriteLine("Data not changed skipping");
                    continue;
                }

                List<Row> rows = new List<Row>();
                foreach (KeyValuePair<string, Dictionary<string, dynamic>> kvp in delayeredResult.Collection)
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
                            FieldStatus fieldStatus = ResourceFieldStatus(resource, columnName);
                            if (fieldKvp.Value == null || !fieldStatus.IsVisible)
                            {
                                continue;
                            }
                            row.Fields.Add(COLUMN_ESCAPE + columnName + COLUMN_ESCAPE);
                            if (fieldKvp.Value is String)
                            {
                                if (string.IsNullOrEmpty(fieldKvp.Value) && fieldStatus.IsNullByDefault)
                                {
                                    row.Values.Add(NULL);
                                    continue;
                                }
                                row.Values.Add(QUOTATION + fieldKvp.Value + QUOTATION);
                                continue;
                            }
                            if (fieldKvp.Value.Type == Newtonsoft.Json.Linq.JTokenType.String)
                            {
                                if (string.IsNullOrEmpty(fieldKvp.Value.Value) && fieldStatus.IsNullByDefault)
                                {
                                    row.Values.Add(NULL);
                                    continue;
                                }
                                row.Values.Add(QUOTATION + MySqlHelper.EscapeString(Convert.ToString(fieldKvp.Value.Value)) + QUOTATION);
                                continue;
                            }
                            if (fieldKvp.Value.Type == Newtonsoft.Json.Linq.JTokenType.Date)
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
                        Console.WriteLine("Reading: " + resourceName);
                        rows.Add(row);
                    }
                }

                using (MySqlConnection conn = new MySqlConnection("Server=informplus-beta.rds.esd.org.uk;Port=3306;Database=ServiceDirectoryCombined;Uid=awsuserbeta;Pwd=pQr1$m"))
                {
                    conn.Open();

                    try
                    {
                        RunSQL("SET FOREIGN_KEY_CHECKS=0;", conn);
                        List<string> commands = new List<string>();
                        foreach (Row row in rows)
                        {
                            commands.Add(row.ToSQL(keyReWrite));

                            if (commands.Count > 1000)
                            {
                                ExecuteBatch(commands, conn);                                
                            }
                        }

                        ExecuteBatch(commands, conn);
                    }
                    finally
                    {
                        try
                        {
                            RunSQL("SET FOREIGN_KEY_CHECKS=1;", conn);
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine("Unable to save due to inconsistent data: " + e.Message);
                            Console.ReadKey();
                        }
                    }

                    hashDatabase.Hashes[baseUrl.URL] = delayeredResult.Hashes;
                    hashDatabase.Save();
                }
            }
            Console.WriteLine("Import done");
        }

        private static void ExecuteBatch(List<string> commands, MySqlConnection conn)
        {
            try
            {
                RunSQL(commands, conn);
            }
            catch (MySqlException e)
            {
                if (e.Number != 1062)
                {
                    RunSQL(commands, conn);
                }
            }
            catch (Exception e)
            {
                RunSQL(commands, conn);
                if (!e.Message.StartsWith("Cannot add or update a child row: a foreign key constraint fails"))
                {
                    Console.WriteLine(e.Message);
                }
            }
            commands.Clear();
        }

        private static bool HasUpdated(DelayeredResult delayeredResult, HashSet<int> previousCodes)
        {
            foreach (int hash in delayeredResult.Hashes)
            {
                if (!previousCodes.Contains(hash))
                {
                    return true;
                }
            }
            return false;
        }

        private static void RunSQL(List<string> sql, MySqlConnection conn)
        {
            Console.WriteLine("Executing " + sql.Count + " rows.");
            RunSQL(string.Join(string.Empty, sql), conn);
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

        private static FieldStatus ResourceFieldStatus(dynamic resource, string name)
        {
            foreach (dynamic field in resource.schema.fields)
            {
                if (field.name.Value == name)
                {
                    return new FieldStatus(IsVisible(field), IsNullByDefault(field));
                }
            }
            return new FieldStatus(false, false);
        }

        private static bool IsNullByDefault(dynamic item)
        {
            if (item.geoType != null && item.geoType.Value == "geometry")
            {
                return true;
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
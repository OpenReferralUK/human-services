using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Linq;
using System.Net;
using Newtonsoft.Json;
using MySql.Data.MySqlClient;
using System.Data;

namespace GoogleSheets
{
    class Program
    {
        // If modifying these scopes, delete your previously saved credentials
        // at ~/.credentials/sheets.googleapis.com-dotnet-quickstart.json
        static string[] Scopes = { SheetsService.Scope.Spreadsheets };
        static string ApplicationName = "Open Referral Sync Tool";
        private const int API_THROTTLE_WAIT = 1000;
        static void Main(string[] args)
        {
            UserCredential credential;

            using (var stream =
                new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            {
                // The file token.json stores the user`s access and refresh tokens, and is created
                // automatically when the authorization flow completes for the first time.
                string credPath = "token.json";
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    Scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(credPath, true)).Result;
                Console.WriteLine("Credential file saved to: " + credPath);
            }

            // Create Google Sheets API service.
            var service = new SheetsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });

            dynamic results;
            using (WebClient client = new WebClient())
            {
                string s = client.DownloadString("https://api.porism.com/ServiceDirectoryService/services/");
                results = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(s);
            }

            string databaseName = "ServiceDirectory";
            using (MySqlConnection connection = new MySqlConnection("Server=informplus-beta.rds.esd.org.uk; database="+ databaseName + "; UID=awsuserbeta; password=pQr1$m;Convert Zero Datetime=True"))
            {
                connection.Open();

                using (WebClient client = new WebClient())
                {
                    dynamic json = JsonConvert.DeserializeObject(client.DownloadString("https://raw.githubusercontent.com/esd-org-uk/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json"));
                    foreach (dynamic resource in json.resources)
                    {
                        if (!showItem(resource))
                        {
                            continue;
                        }

                        string sheetName = resource.name;

                        DataTable table = GetTable(sheetName, databaseName, connection);
                        if (table == null)
                        {
                            //there is no table skip this
                            continue;
                        }

                        Console.WriteLine("Create Sheet: " + sheetName);

                        CreateSheet(service, "1t9XlMltUpVPKKpFn65qT6ldk6NoZhBI5S4fjDeSSgVg", sheetName);
                        int index = 0;
                        foreach (dynamic field in resource.schema.fields)
                        {
                            if (!showItem(resource))
                            {
                                continue;
                            }
                            string columnName = field.name.Value;
                            
                            if (!table.Columns.Contains(columnName) || columnName == "extent")
                            {
                                continue;
                            }

                            Console.WriteLine("Create Column Name: " + columnName);
                            InsertColumnLine(service, "1t9XlMltUpVPKKpFn65qT6ldk6NoZhBI5S4fjDeSSgVg", sheetName + "!" + GetColumnName(index) + "1", columnName);
                            
                            List<object> columnValues = new List<object>();
                            foreach(DataRow row in table.Rows)
                            {
                                columnValues.Add(row[columnName]);
                            }

                            Console.WriteLine("Load Column Values: " + columnName);
                            List<List<object>> columnBatches = SplitList(columnValues, 1000);
                            int rowNumber = 2;
                            foreach (List<object> columnBatch in columnBatches)
                            {
                                InsertColumnLine(service, "1t9XlMltUpVPKKpFn65qT6ldk6NoZhBI5S4fjDeSSgVg", sheetName + "!" + GetColumnName(index) + rowNumber, columnBatch.ToArray());
                                rowNumber += columnBatch.Count;
                            }

                            index++;
                        }
                    }
                }
            }
            Console.ReadKey();

            // Define request parameters.
            String spreadsheetId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms";
            String range = "Class Data!A2:E";
            SpreadsheetsResource.ValuesResource.GetRequest request =
                    service.Spreadsheets.Values.Get(spreadsheetId, range);

            // Prints the names and majors of students in a sample spreadsheet:
            // https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
            ValueRange response = request.Execute();
            IList<IList<Object>> values = response.Values;
            if (values != null && values.Count > 0)
            {
                Console.WriteLine("Name, Major");
                foreach (var row in values)
                {
                    // Print columns A and E, which correspond to indices 0 and 4.
                    Console.WriteLine("{0}, {1}", row[0], row[4]);
                }
            }
            else
            {
                Console.WriteLine("No data found.");
            }
            Console.Read();
        }

        public static List<List<object>> SplitList(List<object> vals, int nSize = 30)
        {
            var list = new List<List<object>>();

            for (int i = 0; i < vals.Count; i += nSize)
            {
                list.Add(vals.GetRange(i, Math.Min(nSize, vals.Count - i)));
            }

            return list;
        }

        private static void CreateSheet(SheetsService service, string spreadsheetId, string name)
        {
            try
            {
                var addSheetRequest = new AddSheetRequest();
                addSheetRequest.Properties = new SheetProperties();
                addSheetRequest.Properties.Title = name;
                BatchUpdateSpreadsheetRequest batchUpdateSpreadsheetRequest = new BatchUpdateSpreadsheetRequest();
                batchUpdateSpreadsheetRequest.Requests = new List<Request>();
                batchUpdateSpreadsheetRequest.Requests.Add(new Request
                {
                    AddSheet = addSheetRequest
                });

                var batchUpdateRequest = service.Spreadsheets.BatchUpdate(batchUpdateSpreadsheetRequest, spreadsheetId);

                batchUpdateRequest.Execute();
            }
            catch
            {
                try
                {
                    ClearValuesRequest clearValuesRequest = new ClearValuesRequest();
                    SpreadsheetsResource.ValuesResource.ClearRequest request = service.Spreadsheets.Values.Clear(clearValuesRequest, spreadsheetId, name + "!$A$1:$YY");
                    ClearValuesResponse response = request.Execute();
                    Thread.Sleep(API_THROTTLE_WAIT);
                }
                catch
                {
                    //sheet doesn`t exist
                }
            }
            finally
            {
                Thread.Sleep(API_THROTTLE_WAIT);
            }
        }

        public static AppendValuesResponse InsertColumnLine(SheetsService service, string spreadsheetId, string range, params object[] columnValues)
        {
            try
            {
                // convert columnValues to columList
                var columList = columnValues.Select(v => new List<object> { v });

                // Add columList to values and input to valueRange
                var values = new List<IList<object>>();
                values.AddRange(columList.ToList());
                var valueRange = new ValueRange()
                {
                    Values = values
                };

                // Create request and execute
                var appendRequest = service.Spreadsheets.Values.Append(valueRange, spreadsheetId, range);
                appendRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.AppendRequest.ValueInputOptionEnum.USERENTERED;
                return appendRequest.Execute();
            }
            finally
            {
                Thread.Sleep(API_THROTTLE_WAIT);
            }
        }

        private static DataTable GetTable(string sourceTable, string database, MySqlConnection connection)
        {
            string cmdText = @"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '"+ database + "' AND TABLE_NAME='" + sourceTable + "'";

            using (MySqlCommand DateCheck = new MySqlCommand(cmdText, connection))
            {
                if (Convert.ToInt32(DateCheck.ExecuteScalar()) == 0)
                {
                    return null;
                }
            }

            using (MySqlDataAdapter adapter = new MySqlDataAdapter(string.Format("SELECT * FROM {0}", sourceTable), connection))
            {
                DataTable data = new DataTable();
                adapter.Fill(data);
                return data;
            }
        }
        private static string GetColumnName(int index)
        {
            const string letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            var value = "";

            if (index >= letters.Length)
                value += letters[index / letters.Length - 1];

            value += letters[index % letters.Length];

            return value;
        }

        private static bool showItem(dynamic item)
        {
            if (item.applicationProfile == null)
            {
                return true;
            }
            foreach(dynamic profile in item.applicationProfile)
            {
                if (profile.name == "LGA" || profile.name == "openReferral")
                {
                    return true;
                }
            }
            return false;
        }
    }
}
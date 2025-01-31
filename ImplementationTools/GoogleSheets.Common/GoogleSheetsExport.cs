﻿using Google.Apis.Auth.OAuth2;
using Google.Apis.Http;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using GoogleSheets.Common.Config;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ServiceDirectory.Common;
using ServiceDirectory.Common.DataStandard;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using static Google.Apis.Sheets.v4.SpreadsheetsResource;

namespace GoogleSheets.Common
{
    public class GoogleSheetsExport
    {
        static string[] Scopes = { SheetsService.Scope.Spreadsheets };
        static string ApplicationName = "Open Referral Sync Tool";
        private const string SheetOneTitle = "Sheet 1";
        private const int CELL_LIMIT = 50000;
        private const int CELL_CUTOFF = 49997;
        public async System.Threading.Tasks.Task WriteToSpreadsheetAsync(string apiBaseUrl, string configPath, APIValidatorSettings settings)
        {
            // The file token.json stores the user`s access and refresh tokens, and is created
            // automatically when the authorization flow completes for the first time.
            ClientSecrets cs = new ClientSecrets();
            cs.ClientId = "856082464201-dfkd0sr7rck00m4vhs740nn8s5e02l64.apps.googleusercontent.com";
            cs.ClientSecret = "PskzuYYlikx-hPuRfot0L7vZ";
            UserCredential credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                cs,
                Scopes,
                "user",
                CancellationToken.None,
                new NullDataStore()).ConfigureAwait(false);

            await Throttler.ThrottleCheck().ConfigureAwait(false);

            string spreadsheetId = await CreateSpreadsheetAsync(credential);

            await WriteToSpreadsheetAsync(spreadsheetId, credential, apiBaseUrl, configPath, settings);
        }

        public async System.Threading.Tasks.Task<string> CreateSpreadsheetAsync(IConfigurableHttpClientInitializer credential)
        {
            SheetsService service = CreateService(credential);

            return await CreateNewWorkBookAsync(service).ConfigureAwait(false);
        }

        private static SheetsService CreateService(IConfigurableHttpClientInitializer credential)
        {
            return new SheetsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });
        }

        public async System.Threading.Tasks.Task<bool> WriteToSpreadsheetAsync(string spreadsheetId, IConfigurableHttpClientInitializer credential, string apiBaseUrl, string configPath, APIValidatorSettings settings)
        {
            SheetsService service = CreateService(credential);

            try
            {
                SheetConfig config = JsonConvert.DeserializeObject<SheetConfig>(File.ReadAllText(configPath));
                //move text to config
                await AddUpdateMessage(spreadsheetId, "Please wait while your export is generated, once completed this sheet will be deleted.", service).ConfigureAwait(false);

                DelayeredResult result = await Delayering.DelayerPaginatedData(apiBaseUrl, settings).ConfigureAwait(false);


                if (result.Collection.Count == 0)
                {

                    await AddUpdateMessage(spreadsheetId, "ERROR: service directory data not found at the given URL", service);
                    return false;

                }

                Dictionary<string, string> columnToSheetIndex = new Dictionary<string, string>();
                List<ForeignKeyAssociaion> foreignKeys = new List<ForeignKeyAssociaion>();
                List<Comment> comments = new List<Comment>();
                List<HideColumn> hideColumns = new List<HideColumn>();
                ResourceReader resourceReader = new ResourceReader();
                dynamic resources = await resourceReader.GetResources().ConfigureAwait(false);

                foreach (dynamic resource in resources)
                {
                    if (!Resources.ShowItem(resource))
                    {
                        continue;
                    }

                    string sheetName = resource.name;

                    if (!result.Collection.ContainsKey(sheetName))
                    {
                        continue;
                    }

                    Console.WriteLine("Create Sheet: " + sheetName);

                    await CreateSheetAsync(service, spreadsheetId, sheetName, config).ConfigureAwait(false);

                    int sheetId = await GetSheetIdFromSheetNameAsync(service, spreadsheetId, sheetName).ConfigureAwait(false);

                    List<ForeignKeyAssociaion> localForeignKeys = new List<ForeignKeyAssociaion>();
                    if (resource.schema.foreignKeys != null)
                    {
                        foreach (dynamic fk in resource.schema.foreignKeys)
                        {
                            localForeignKeys.Add(new ForeignKeyAssociaion(sheetId, sheetName, fk.fields.Value, fk.reference.resource.Value, fk.reference.fields.Value));
                        }
                    }

                    int index = 0;
                    int columnNo = -1;
                    foreach (dynamic field in resource.schema.fields)
                    {
                        if (!Resources.ShowItem(field))
                        {
                            continue;
                        }
                        string columnName = field.name.Value;

                        if (columnName == "extent")
                        {
                            continue;
                        }

                        if (config.IsColumnHidden(sheetName, columnName))
                        {
                            hideColumns.Add(new HideColumn(sheetName, index));
                        }

                        Console.WriteLine("Create Column Name: " + columnName);
                        columnNo++;
                        List<object> columnValues = new List<object>();
                        columnValues.Add(columnName);
                        foreach (dynamic obj in result.Collection[sheetName].Values)
                        {
                            if (!((IDictionary<String, dynamic>)obj).ContainsKey(columnName))
                            {
                                columnValues.Add(string.Empty);
                            }
                            else
                            {
                                columnValues.Add(((IDictionary<String, dynamic>)obj)[columnName]);
                            }
                        }

                        Console.WriteLine("Load Column Values: " + columnName);
                        List<List<object>> columnBatches = SplitList(columnValues, 30000);
                        int rowNumber = 1;
                        foreach (List<object> columnBatch in columnBatches)
                        {
                            string colRange = sheetName + "!" + GetColumnName(index);
                            foreach (ForeignKeyAssociaion localForeignKey in localForeignKeys)
                            {
                                if (localForeignKey.Field == columnName)
                                {
                                    localForeignKey.StartColumnIndex = index;
                                    localForeignKey.Found = true;
                                }
                            }
                            SaveColumnRange(columnToSheetIndex, sheetName, columnName, colRange + (rowNumber + 1) + ":" + GetColumnName(index) + columnValues.Count);
                            await InsertColumnLineAsync(service, spreadsheetId, colRange + rowNumber, columnBatch.ToArray()).ConfigureAwait(false);
                            rowNumber += columnBatch.Count;
                        }

                        string comment = config.GetComment(sheetName, columnName);
                        if (!string.IsNullOrEmpty(comment))
                        {
                            comments.Add(new Comment(await GetSheetIdFromSheetNameAsync(service, spreadsheetId, sheetName).ConfigureAwait(false), columnNo, comment));
                        }

                        index++;
                    }
                    foreignKeys.AddRange(localForeignKeys);
                }

                if (hideColumns.Count > 0)
                {
                    await HideColumnsAsync(service, spreadsheetId, hideColumns).ConfigureAwait(false);
                }

                await AddForiegnKeysAsync(service, foreignKeys, columnToSheetIndex, spreadsheetId).ConfigureAwait(false);

                comments.AddRange(await AddExtraColumnsAsync(service, config, columnToSheetIndex, spreadsheetId).ConfigureAwait(false));

                if (comments.Count > 0)
                {
                    await InsertColumnNotesAsync(service, spreadsheetId, comments);
                }

                await DeleteOriginalSheet(service, spreadsheetId).ConfigureAwait(false);
                return true;
            }
            catch (SocketException eio)
            {
                await AddUpdateMessage(spreadsheetId, "ERROR: a network error occured: " + eio.Message + " contact support at support@esd.org.uk if this happens again.", service);
                throw eio;
            }
            catch (Exception e)
            {
                await AddUpdateMessage(spreadsheetId, "ERROR: import error:" + e.Message, service);
                throw e;
            }
        }

        private static async Task AddUpdateMessage(string spreadsheetId, string message, SheetsService service)
        {
            List<string> values = new List<string>();
            values.Add(message);
            await InsertColumnLineAsync(service, spreadsheetId, "Sheet1!" + GetColumnName(0) + "1", values.ToArray()).ConfigureAwait(false);
        }

        private async System.Threading.Tasks.Task DeleteOriginalSheet(SheetsService service, string spreadsheetId)
        {
            try
            {
                var requestBody = new Google.Apis.Sheets.v4.Data.BatchUpdateSpreadsheetRequest();
                var requests = new List<Request>();
                DeleteSheetRequest deleteSheet = new DeleteSheetRequest();
                deleteSheet.SheetId = await GetSheetIdFromSheetNameAsync(service, spreadsheetId, SheetOneTitle).ConfigureAwait(false);
                var deleteRequest = new Request()
                {
                    DeleteSheet = deleteSheet
                };
                requests.Add(deleteRequest);
                requestBody.Requests = requests;
                var batchRequest = service.Spreadsheets.BatchUpdate(requestBody, spreadsheetId);
                await ExecuteRequestAsync(async delegate ()
                {
                    return await batchRequest.ExecuteAsync().ConfigureAwait(false);
                });
            }
            finally
            {
                await Throttler.ThrottleCheck().ConfigureAwait(false);
            }
        }

        private static async System.Threading.Tasks.Task<string> CreateNewWorkBookAsync(SheetsService service)
        {
            try
            {
                Spreadsheet requestBody = new Spreadsheet();
                requestBody.Properties = new SpreadsheetProperties();
                requestBody.Properties.Title = "Service Directory Generated: " + DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"); ;
                SpreadsheetsResource.CreateRequest request = service.Spreadsheets.Create(requestBody);
                Spreadsheet response = await ExecuteRequestAsync(async delegate() { return await request.ExecuteAsync().ConfigureAwait(false); });
                return response.SpreadsheetId;
            }
            finally
            {
                await Throttler.ThrottleCheck().ConfigureAwait(false);
            }
        }

        private static async System.Threading.Tasks.Task<T> ExecuteRequestAsync<T>(Func<Task<T>> executeCall)
        {
            for (int i = 0; i < 3; i++)
            {
                try
                {
                    return await executeCall();
                }
                catch (Exception e)
                {
                    if (i == 2)
                    {
                        throw e;
                    }
                    await Task.Delay(10000);
                }
            }
            return default(T);
        }

        /// <summary>
        /// This is how you read a spreadsheet
        /// </summary>
        /// <param name="service"></param>
        private static async System.Threading.Tasks.Task ExampleRead(SheetsService service)
        {
            // Define request parameters.
            String spreadsheetId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms";
            String range = "Class Data!A2:E";
            SpreadsheetsResource.ValuesResource.GetRequest request =
                    service.Spreadsheets.Values.Get(spreadsheetId, range);

            // Prints the names and majors of students in a sample spreadsheet:
            // https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
            ValueRange response = await ExecuteRequestAsync(async delegate () { return await request.ExecuteAsync().ConfigureAwait(false); }); 
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
        }

        private async System.Threading.Tasks.Task<int> GetSheetIdFromSheetNameAsync(SheetsService service, string sSpreadsheetId, string sheetName)
        { 
            Google.Apis.Sheets.v4.Data.Spreadsheet gsSpreadsheet;

            try
            {
                gsSpreadsheet = await ExecuteRequestAsync(async delegate ()
                {
                    return await service.Spreadsheets.Get(sSpreadsheetId).ExecuteAsync().ConfigureAwait(false);
                });

                foreach (Sheet gsSheet in gsSpreadsheet.Sheets)
                {
                    if (gsSheet.Properties.Title != sheetName)
                    {
                        continue;
                    }
                    return (gsSheet.Properties.SheetId).GetValueOrDefault(-1);
                }
            }
            catch (Exception ex)
            {
                throw new ServiceDirectoryException("Error reading sheet id from name", ex);
            }
            finally
            {
                await Throttler.ThrottleCheck().ConfigureAwait(false);
            }

            return 0;
        }

        private async System.Threading.Tasks.Task<List<Comment>> AddExtraColumnsAsync(SheetsService service, SheetConfig config, Dictionary<string, string> columnToSheetIndex, string spreadsheetId)
        {
            List<Comment> comments = new List<Comment>();
            Dictionary<string, int> columnCount = new Dictionary<string, int>();
            foreach(AddColumn column in config.Columns)
            {
                if (!columnCount.ContainsKey(column.Sheet))
                {
                    columnCount.Add(column.Sheet, ColumnsPerSheet(column.Sheet, columnToSheetIndex));
                }
                List<string> values = new List<string>();
                values.Add(column.Title);
                string formula = column.Value;
                bool isVLookup = formula.StartsWith("=VLOOKUP");
                MatchCollection matches = Regex.Matches(column.Value, @"({[a-zA-Z\._\~]*})", RegexOptions.Compiled | RegexOptions.IgnoreCase);
                List<string> refIds = new List<string>();
                bool missing = false;
                for (int i = 0; i < matches.Count; i++)
                {
                    Match match = matches[i];
                    string col = match.Value;
                    col = col.Replace("{", string.Empty);
                    col = col.Replace("}", string.Empty);
                    col = col.Replace(".", "|");
                    if (!columnToSheetIndex.ContainsKey(col.Replace("~", string.Empty)))
                    {
                        missing = true;
                        break;
                    }
                    if (i == 0 || !isVLookup)
                    {
                        if (col.Contains("~"))
                        {
                            col = col.Replace("~", string.Empty);
                            formula = formula.Replace(match.Value, columnToSheetIndex[col]);
                            continue;
                        }
                        string refId = columnToSheetIndex[col].Split(':')[0];
                        formula = formula.Replace(match.Value, refId);
                        refIds.Add(refId);
                    }
                    else if (i > 1)
                    {
                        formula = formula.Replace(match.Value, columnToSheetIndex[col].Split(':')[1]);
                    }
                    else
                    {
                        formula = formula.Replace(match.Value, columnToSheetIndex[col].Split(':')[0]);
                    }
                }
                if (missing)
                {
                    continue;
                }
                int rows = RowsPerSheet(column.Sheet, columnToSheetIndex);
                foreach (string refId in refIds)
                {
                    string rowId = Regex.Match(refId, @"\d+").Value;
                    int startRow = Convert.ToInt32(rowId);
                    string basicId = refId.Replace(rowId, string.Empty);
                    for (int j = 0; j < rows; j++)
                    {
                        string newId = basicId + (startRow + j);
                        if ((j + 1) < values.Count)
                        {
                            values[(j + 1)] = values[(j + 1)].Replace(refId, newId);
                            continue;
                        }
                        values.Add(formula.Replace(refId, newId));
                    }
                }
                for (int i = 0; i < values.Count; i++)
                {
                    if (i == 0)
                    {
                        //skip header
                        continue;
                    }
                    if (values[i].StartsWith("="))
                    {
                        values[i] = values[i].Substring(1);
                    }
                    values[i] = "=IFERROR(" + values[i] + ",\"\")";
                }
                await InsertColumnLineAsync(service, spreadsheetId, GetRange(columnToSheetIndex, columnCount, column, rows, 1), values.ToArray()).ConfigureAwait(false);
                if (!string.IsNullOrEmpty(column.Comment))
                {
                    comments.Add(new Comment(await GetSheetIdFromSheetNameAsync(service, spreadsheetId, column.Sheet).ConfigureAwait(false), columnCount[column.Sheet], column.Comment));
                }
                columnToSheetIndex[column.Sheet + "|" + column.Title] = GetRange(columnToSheetIndex, columnCount, column, rows, 2);
                columnCount[column.Sheet] = columnCount[column.Sheet] + 1;
            }
            return comments;
        }

        private static string GetRange(Dictionary<string, string> columnToSheetIndex, Dictionary<string, int> columnCount, AddColumn column, int rows, int startRow)
        {
            return column.Sheet + "!" + GetColumnName(columnCount[column.Sheet]) + startRow + ":" + GetColumnName(ColumnsPerSheet(column.Sheet, columnToSheetIndex)) + rows;
        }

        private static int ColumnsPerSheet(string sheet, Dictionary<string, string> columnToSheetIndex)
        {
            string key = sheet + "|";
            int count = 0;
            foreach (KeyValuePair<string, string> kvp in columnToSheetIndex)
            {
                if (kvp.Key.StartsWith(key))
                {
                    count++;
                }
            }
            return count;
        }

        private static int RowsPerSheet(string sheet, Dictionary<string, string> columnToSheetIndex)
        {
            string key = sheet + "|";
            foreach(KeyValuePair<string, string> kvp in columnToSheetIndex)
            {
                if (kvp.Key.StartsWith(key))
                {
                    string number = string.Empty;
                    foreach (char c in kvp.Value)
                    {
                        if (!char.IsDigit(c))
                        {
                            number = string.Empty;
                            continue;
                        }
                        number += c;
                    }
                    return Convert.ToInt32(number);
                }
            }
            return 0;
        }
        private static async System.Threading.Tasks.Task AddForiegnKeysAsync(SheetsService service, List<ForeignKeyAssociaion> foreignKeys, Dictionary<string, string> columnToSheetIndex, string spreadsheetId)
        {
            var requests = new List<Request>();            

            foreach (ForeignKeyAssociaion association in foreignKeys)
            {
                if (!association.Found)
                {
                    continue;
                }

                string range;
                if (!columnToSheetIndex.ContainsKey(association.ReferenceTable + "|" + association.ReferenceField))
                {
                    continue;
                }
                range = columnToSheetIndex[association.ReferenceTable + "|" + association.ReferenceField];
                var updateCellsRequest = new Request()
                {
                    SetDataValidation = new SetDataValidationRequest()
                    {
                        Range = new GridRange()
                        {
                            SheetId = association.SheetId,
                            StartRowIndex = 1,
                            StartColumnIndex = association.StartColumnIndex,
                            EndColumnIndex = association.StartColumnIndex + 1
                        },
                        Rule = new DataValidationRule()
                        {
                            Condition = new BooleanCondition()
                            {
                                Type = "ONE_OF_RANGE",

                                Values = new List<ConditionValue>()
                                    {
                                        new ConditionValue()
                                        {
                                            UserEnteredValue = "=" + range,
                                        }
                                    }
                            },
                            InputMessage = "It must match associated key",
                            ShowCustomUi = true,
                            Strict = true
                        }
                    }
                };
                requests.Add(updateCellsRequest);
            }

            var requestBody = new Google.Apis.Sheets.v4.Data.BatchUpdateSpreadsheetRequest();
            requestBody.Requests = requests;
            var batchRequest = service.Spreadsheets.BatchUpdate(requestBody, spreadsheetId);
            await ExecuteRequestAsync(async delegate ()
            {
                return await batchRequest.ExecuteAsync().ConfigureAwait(false);
            });
            await Throttler.ThrottleCheck().ConfigureAwait(false);
        }

        private static void SaveColumnRange(Dictionary<string, string> columnToSheetIndex, string sheetName, string columnName, string colRange)
        {
            string key = sheetName + "|" + columnName;
            if (!columnToSheetIndex.ContainsKey(key))
            {
                columnToSheetIndex.Add(key, colRange);
            }
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

        private async System.Threading.Tasks.Task HideColumnsAsync(SheetsService service, string spreadsheetId, List<HideColumn> hideColumns)
        {
            try
            {
                List<Request> requests = new List<Request>();

                foreach (HideColumn hideColumn in hideColumns)
                {
                    var updateDimensionRequest = new UpdateDimensionPropertiesRequest();
                    updateDimensionRequest.Properties = new DimensionProperties();
                    updateDimensionRequest.Properties.HiddenByUser = true;
                    updateDimensionRequest.Fields = "hiddenByUser";
                    updateDimensionRequest.Range = new DimensionRange()
                    {
                        Dimension = "COLUMNS",
                        SheetId = await GetSheetIdFromSheetNameAsync(service, spreadsheetId, hideColumn.Name).ConfigureAwait(false),
                        StartIndex = hideColumn.Index,
                        EndIndex = hideColumn.Index + 1
                    };
                    requests.Add(new Request
                    {
                        UpdateDimensionProperties = updateDimensionRequest
                    });
                }

                BatchUpdateSpreadsheetRequest batchUpdateSpreadsheetRequest = new BatchUpdateSpreadsheetRequest();
                batchUpdateSpreadsheetRequest.Requests = requests;

                var batchUpdateRequest = service.Spreadsheets.BatchUpdate(batchUpdateSpreadsheetRequest, spreadsheetId);

                await ExecuteRequestAsync(async delegate ()
                {
                    return await batchUpdateRequest.ExecuteAsync().ConfigureAwait(false);
                });
            }
            finally
            {
                await Throttler.ThrottleCheck().ConfigureAwait(false);
            }
        }

        private async System.Threading.Tasks.Task CreateSheetAsync(SheetsService service, string spreadsheetId, string name, SheetConfig config)
        {
            try
            {
                List<Request> requests = new List<Request>();

                var addSheetRequest = new AddSheetRequest();
                addSheetRequest.Properties = new SheetProperties();
                addSheetRequest.Properties.Title = name;
                addSheetRequest.Properties.Hidden = config.IsSheetHidden(name);

                requests.Add(new Request
                {
                    AddSheet = addSheetRequest
                });

                var repeatCellRequest = new RepeatCellRequest();
                repeatCellRequest.Range = new GridRange()
                {
                    SheetId = await GetSheetIdFromSheetNameAsync(service, spreadsheetId, name).ConfigureAwait(false),
                    StartRowIndex = 0,
                    StartColumnIndex = 0,
                    EndColumnIndex = 1000
                };
                repeatCellRequest.Fields = "userEnteredFormat.numberFormat";
                repeatCellRequest.Cell = new CellData() { UserEnteredFormat = new CellFormat() { NumberFormat = new NumberFormat() { Type = "TEXT" } } };

                requests.Add(new Request
                {
                    RepeatCell = repeatCellRequest
                });


                BatchUpdateSpreadsheetRequest batchUpdateSpreadsheetRequest = new BatchUpdateSpreadsheetRequest();
                batchUpdateSpreadsheetRequest.Requests = requests;

                BatchUpdateRequest batchUpdateRequest = service.Spreadsheets.BatchUpdate(batchUpdateSpreadsheetRequest, spreadsheetId);

                await ExecuteRequestAsync(async delegate ()
                {
                    return await batchUpdateRequest.ExecuteAsync().ConfigureAwait(false);
                });
                await Throttler.ThrottleCheck().ConfigureAwait(false);
            }
            catch
            {
                try
                {
                    ClearValuesRequest clearValuesRequest = new ClearValuesRequest();
                    SpreadsheetsResource.ValuesResource.ClearRequest request = service.Spreadsheets.Values.Clear(clearValuesRequest, spreadsheetId, name + "!$A$1:$YY");
                    ClearValuesResponse response = await ExecuteRequestAsync(async delegate ()
                    {
                        return await request.ExecuteAsync().ConfigureAwait(false);
                    });
                    await Throttler.ThrottleCheck().ConfigureAwait(false);

                    //remove validations
                    BatchUpdateSpreadsheetRequest batchUpdateSpreadsheetRequest = new BatchUpdateSpreadsheetRequest();
                    batchUpdateSpreadsheetRequest.Requests = new List<Request>();
                    batchUpdateSpreadsheetRequest.Requests.Add(new Request()
                    {
                        SetDataValidation = new SetDataValidationRequest()
                        {
                            Range = new GridRange()
                            {
                                SheetId = await GetSheetIdFromSheetNameAsync(service, spreadsheetId, name).ConfigureAwait(false),
                                StartRowIndex = 0,
                                StartColumnIndex = 0,
                                EndColumnIndex = 1000
                            }
                        }
                    });
                    var batchUpdateRequest = service.Spreadsheets.BatchUpdate(batchUpdateSpreadsheetRequest, spreadsheetId);
                    await ExecuteRequestAsync(async delegate ()
                    {
                        return await batchUpdateRequest.ExecuteAsync().ConfigureAwait(false);
                    });
                    await Throttler.ThrottleCheck().ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    //sheet doesn`t exist
                    throw new ServiceDirectoryException("Unable to create spreadsheet", e);
                }
            }
        }

        public static async System.Threading.Tasks.Task InsertColumnNotesAsync(SheetsService service, string spreadsheetId, List<Comment> comments)
        {
            try
            {
                var requests = new List<Request>();

                foreach (Comment comment in comments)
                {
                    var gridRange = new Google.Apis.Sheets.v4.Data.GridRange
                    {
                        EndColumnIndex = comment.ColumnNo + 1,
                        StartColumnIndex = comment.ColumnNo,
                        EndRowIndex = 1,
                        StartRowIndex = 0,
                        SheetId = comment.SheetID
                    };

                    var request = new Google.Apis.Sheets.v4.Data.Request();
                    request.UpdateCells = new Google.Apis.Sheets.v4.Data.UpdateCellsRequest();
                    request.UpdateCells.Range = gridRange;
                    request.UpdateCells.Fields = "note";
                    request.UpdateCells.Rows = new List<Google.Apis.Sheets.v4.Data.RowData>();
                    request.UpdateCells.Rows.Add(new Google.Apis.Sheets.v4.Data.RowData());
                    request.UpdateCells.Rows[0].Values = new List<Google.Apis.Sheets.v4.Data.CellData>();
                    request.UpdateCells.Rows[0].Values.Add(new Google.Apis.Sheets.v4.Data.CellData());
                    request.UpdateCells.Rows[0].Values[0].Note = comment.Text;
                    
                    requests.Add(request);
                }
                var requestBody = new Google.Apis.Sheets.v4.Data.BatchUpdateSpreadsheetRequest();
                requestBody.Requests = requests;

                var batchRequest = service.Spreadsheets.BatchUpdate(requestBody, spreadsheetId);
                await ExecuteRequestAsync(async delegate ()
                {
                    return await batchRequest.ExecuteAsync().ConfigureAwait(false);
                });
            }
            finally
            {
                await Throttler.ThrottleCheck().ConfigureAwait(false);
            }
        }
        
        public static async System.Threading.Tasks.Task<AppendValuesResponse> InsertColumnLineAsync(SheetsService service, string spreadsheetId, string range, params object[] columnValues)
        {
            try
            {
                List<object> newValues = new List<object>();
                if (columnValues != null)
                {
                    foreach(object columnValue in columnValues)
                    {
                        if (columnValue != null && columnValue is string)
                        {
                            string val = (string)columnValue;
                            if (val != null && val.Length > CELL_LIMIT)
                            {
                                newValues.Add(val.Substring(0, CELL_CUTOFF) + "...");
                                continue;
                            }
                        }
                        if (columnValue != null && columnValue is JValue)
                        {
                            JValue val = (JValue)columnValue;
                            if (val.Type == JTokenType.String)
                            {
                                string str = (string)val.Value;
                                if (str != null && str.Length > CELL_LIMIT)
                                {
                                    newValues.Add(str.Substring(0, CELL_CUTOFF) + "...");
                                    continue;
                                }
                            }
                        }
                        newValues.Add(columnValue);
                    }
                }
                // convert columnValues to columList
                var columList = newValues.Select(v => new List<object> { v });

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
                return await ExecuteRequestAsync(async delegate () {
                    return await appendRequest.ExecuteAsync().ConfigureAwait(false);
                });
            }
            finally
            {
                await Throttler.ThrottleCheck().ConfigureAwait(false);
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
    }
}

using GoogleSheets.Common;

namespace GoogleSheets
{
    class Program
    {
        static void Main(string[] args)
        {
            GoogleSheetsExport.WriteToSpreadsheetAsync("https://blackburn.openplace.directory/o/ServiceDirectoryService/v2", "configuration.json").GetAwaiter().GetResult();
        }        
    }
}
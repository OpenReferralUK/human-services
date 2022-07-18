using GoogleSheets.Common;
using ServiceDirectory.Common;

namespace GoogleSheets
{
    class Program
    {
        static void Main(string[] args)
        {
            APIValidatorSettings settings = new APIValidatorSettings();
            GoogleSheetsExport.WriteToSpreadsheetAsync("https://blackburn.openplace.directory/o/ServiceDirectoryService/v2", "configuration.json", settings).GetAwaiter().GetResult();
        }        
    }
}
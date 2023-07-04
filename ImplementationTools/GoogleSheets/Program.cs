using GoogleSheets.Common;
using ServiceDirectory.Common;

namespace GoogleSheets
{
    class Program
    {
        static void Main(string[] args)
        {
            APIValidatorSettings settings = new APIValidatorSettings();
            DelayeredResult result = Delayering.DelayerPaginatedData("https://blackburn.openplace.directory/o/ServiceDirectoryService/v2", settings).GetAwaiter().GetResult();
            var a = 1;
            //GoogleSheetsExport.WriteToSpreadsheetAsync("https://blackburn.openplace.directory/o/ServiceDirectoryService/v2", "configuration.json", settings).GetAwaiter().GetResult();
        }        
    }
}
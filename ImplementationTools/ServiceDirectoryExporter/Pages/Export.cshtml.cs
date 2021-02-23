using Google.Apis.Auth.AspNetCore3;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using GoogleSheets.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ServiceDirectoryExporter.Pages
{
    [BindProperties]
    [GoogleScopedAuthorize(SheetsService.ScopeConstants.Spreadsheets)]
    public class ExportModel : PageModel
    {
        private readonly ILogger<ExportModel> _logger;

        public ExportModel(ILogger<ExportModel> logger)
        {
            _logger = logger;
        }
        
        public async Task OnGetAsync([FromServices] IGoogleAuthProvider auth, string BaseURL)
        {
            GoogleCredential credential = null;
            int attempt = 0;

            while (attempt < 3)
            {
                try
                {
                    credential = await auth.GetCredentialAsync();
                    break;
                }
                catch (InvalidOperationException)
                {
                    attempt++;
                    foreach (string key in Request.Cookies.Keys)
                    {
                        Response.Cookies.Delete(key);
                    }
                }
            }

            string spreadsheetId = await GoogleSheetsExport.CreateSpreadsheetAsync(credential);
            Thread t2 = new Thread(async delegate ()
            {
                await GoogleSheetsExport.WriteToSpreadsheetAsync(spreadsheetId, credential, BaseURL, "configuration.json");
            });
            t2.Start();

            Response.Redirect("https://docs.google.com/spreadsheets/d/" + spreadsheetId + "/");
        }
    }
}

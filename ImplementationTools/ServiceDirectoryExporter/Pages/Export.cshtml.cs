using Google.Apis.Auth.AspNetCore3;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using GoogleSheets.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using ServiceDirectory.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ServiceDirectoryExporter.Pages
{
    [BindProperties]
    [GoogleScopedAuthorize(SheetsService.ScopeConstants.Spreadsheets)]
    public class ExportModel : PageModel
    {
        [TempData]
        public string MsgText { get; set; }
        private readonly ILogger<ExportModel> _logger;

        public ExportModel(ILogger<ExportModel> logger)
        {
            _logger = logger;
        }
        
        public async Task OnGetAsync([FromServices] IGoogleAuthProvider auth, string BaseURL)
        {

            Urls url = new Urls(BaseURL);
            
            if (string.IsNullOrEmpty(BaseURL) || !url.UrlAbsolute() || !url.UrlValid())
            {
                MsgText = "Service directory not found, check you have specified the correct URL"; //move all text to config
                Response.Redirect(string.Format("{0}://{1}{2}", Request.Scheme, Request.Host.Host, Url.Content("~")));
                return;
            }

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

            GoogleSheetsExport googleSheetsExport = new GoogleSheetsExport();
            string spreadsheetId = await googleSheetsExport.CreateSpreadsheetAsync(credential);
            Thread t2 = new Thread(async delegate ()
            {
                try
                {
                    APIValidatorSettings settings = new APIValidatorSettings();
                    settings.LargePerPages = true;
                    bool back = await googleSheetsExport.WriteToSpreadsheetAsync(spreadsheetId, credential, BaseURL, "configuration.json", settings);

                } 
                catch(Exception ex)
                {
                    _logger.LogError(ex, ex.Message);
                }
                
               
            });
            
            t2.Start();

            Response.Redirect("https://docs.google.com/spreadsheets/d/" + spreadsheetId + "/");
            
        }

    }
}

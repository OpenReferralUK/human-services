using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using ServiceDirectory.Common;
using ServiceDirectory.Common.Results;

namespace ServiceDirectoryValidator.Pages
{
    public class IndexModel : PageModel
    {
        [BindProperty]
        [Required]
        public string txtBaseUrl { get; set; }
        [BindProperty(SupportsGet = true)]
        [Required]
        public string hidID { get; set; }
        private readonly ILogger<IndexModel> _logger;
         
        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            hidID = Guid.NewGuid().ToString();
        }

        public IActionResult OnGetValidUrl(string baseUrl)
        {
            Urls url = new Urls(baseUrl);


            if (string.IsNullOrEmpty(baseUrl))
            {

                var result = new ServiceDirectory.Common.Results.ValidationResult() { Error = "Please enter the URL for the service directory" };
                return new JsonResult(result);
            }

            if (!url.UrlAbsolute() || !url.UrlValid())
            {

               var result = new ServiceDirectory.Common.Results.ValidationResult() { Error = "Please ensure you specify a valid URL for the service directory." };
                return new JsonResult(result);
            }

            return new JsonResult(true);
        }


        public async System.Threading.Tasks.Task<JsonResult> OnGetValidateAsync(string baseUrl, string id)
        {

            ServiceDirectory.Common.Results.ValidationResult result = await APIValidator.Validate(baseUrl, id, new APIValidatorSettings() { SamplePages = true });
            
            if (result.GetException() != null)
            {
                _logger.LogError(result.GetException(), result.Error);
            }


            return new JsonResult(result);
        }

        public JsonResult OnGetProgress(string id)
        {
            return new JsonResult(APIValidator.Progress(id));
        }
    }
}

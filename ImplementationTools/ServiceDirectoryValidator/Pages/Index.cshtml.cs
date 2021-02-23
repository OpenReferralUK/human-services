using System;
using System.Collections.Generic;
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
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }

        public async System.Threading.Tasks.Task<JsonResult> OnGetValidateAsync(string baseUrl)
        {
            ValidationResult result = await APIValidator.Validate(baseUrl);

            return new JsonResult(result);
        }
    }
}

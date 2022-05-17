using FileHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ORUKTaxonomy.Web.Models;
using ServiceDirectory.Common;
using ServiceDirectory.Common.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ORUKTaxonomy.Web.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        [BindProperty]
        public string URL { get; set; }
        [BindProperty]
        public string Vocabulary { get; set; }

        public async Task<FileResult> OnPostAsync()
        {
            List<Taxonomy> taxonomies = new List<Taxonomy>();
            Paginator paginator = new Paginator();
            APIValidatorSettings settings = new APIValidatorSettings();
            settings.RequestRate = 225;
            HashSet<string> processedIds = new HashSet<string>();
            var paginationResults = await paginator.GetServices(URL, string.Empty, new WebServiceReader(settings), settings);
            foreach(dynamic service in paginationResults.Items)
            {
                if (service.service_taxonomys == null)
                {
                    continue;
                }
                foreach (dynamic service_taxonomy in service.service_taxonomys)
                {
                    if (service_taxonomy.taxonomy == null)
                    {
                        continue;
                    }
                    var taxonomy = service_taxonomy.taxonomy;
                    string id = taxonomy.id;
                    string vocabulary = taxonomy.vocabulary;
                    if (!string.IsNullOrEmpty(Vocabulary) && Vocabulary != vocabulary)
                    {
                        continue;
                    }
                    if (processedIds.Contains(id))
                    {
                        continue;
                    }
                    processedIds.Add(id);
                    taxonomies.Add(new Taxonomy(id, vocabulary));
                }
            }
            FileHelperEngine<Taxonomy> engine = new FileHelperEngine<Taxonomy>() { HeaderText = "Identifier", NewLineForWrite = "\r\n" };
            return File(Encoding.UTF8.GetBytes(engine.WriteString(taxonomies)), "text/csv", "output.csv");
        }

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }
    }
}

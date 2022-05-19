using FileHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ORUKTaxonomy.Web.Models;
using ServiceDirectory.Common;
using ServiceDirectory.Common.Pagination;
using System;
using System.Collections.Generic;
using System.Configuration;
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
        public string BaseUrl { get; set; }
        [BindProperty]
        public string Vocabulary { get; set; }
        private readonly IConfiguration _configuration;

        public async Task<FileResult> OnPostAsync()
        {
            try
            {
                var config = _configuration.GetSection("AppSettings").Get<AppSettings>();

                List<Taxonomy> taxonomies = new List<Taxonomy>();
                Paginator paginator = new Paginator();
                APIValidatorSettings settings = new APIValidatorSettings();
                int requestRate = 225;
                foreach (BaseURL baseURL in config.Urls)
                {
                    if (BaseUrl.StartsWith(baseURL.URL))
                    {
                        requestRate = baseURL.RequestRate;
                        break;
                    }
                }
                settings.RequestRate = requestRate;
                HashSet<string> processedIds = new HashSet<string>();
                var paginationResults = await paginator.GetServices(BaseUrl, string.Empty, new WebServiceReader(settings), settings);
                foreach (dynamic service in paginationResults.Items)
                {
                    if (service.service_taxonomys != null)
                    {
                        foreach (dynamic service_taxonomy in service.service_taxonomys)
                        {
                            if (service_taxonomy.taxonomy == null)
                            {
                                continue;
                            }
                            taxonomies = SaveTaxonomy(service_taxonomy.taxonomy, processedIds, taxonomies);
                        }
                    }
                    if (service.taxonomies != null)
                    {
                        foreach (dynamic taxonomy in service.taxonomies)
                        {
                            if (taxonomy == null)
                            {
                                continue;
                            }
                            taxonomies = SaveTaxonomy(taxonomy, processedIds, taxonomies);
                        }
                    }
                }
                FileHelperEngine<Taxonomy> engine = new FileHelperEngine<Taxonomy>() { HeaderText = "Identifier,Name,Vocabulary", NewLineForWrite = "\r\n" };
                return File(Encoding.UTF8.GetBytes(engine.WriteString(taxonomies)), "text/csv", "TaxonomyTerms.csv");
            }
            catch(Exception e)
            {
                TempData["MsgText"] = e.Message;
                return null;
            }
        }

        private List<Taxonomy> SaveTaxonomy(dynamic taxonomy, HashSet<string> processedIds, List<Taxonomy> taxonomies)
        {
            string id = taxonomy.id;
            string name = taxonomy.name;
            string vocabulary = string.Empty;
            if (HasProperty(taxonomy, "vocabulary"))
            {
                vocabulary = taxonomy.vocabulary;
            }
            if (!string.IsNullOrEmpty(Vocabulary) && Vocabulary != vocabulary)
            {
                return taxonomies;
            }
            string key = id + "|" + vocabulary;
            if (processedIds.Contains(key))
            {
                return taxonomies;
            }
            processedIds.Add(key);
            taxonomies.Add(new Taxonomy(id, name, vocabulary));
            return taxonomies;
        }

        private static bool HasProperty(dynamic settings, string name)
        {
            if (settings is JObject)
            {
                var dictionary = ((JObject)settings).ToObject<Dictionary<string, object>>();

                //return dictionary.Keys.Select(k => k.ToUpperInvariant()).Contains(name.ToUpperInvariant());

                return dictionary.ContainsKey(name);
            }
            return settings.GetType().GetProperty(name) != null;
        }

        public IndexModel(ILogger<IndexModel> logger, IConfiguration configuration)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public void OnGet()
        {

        }
    }
}

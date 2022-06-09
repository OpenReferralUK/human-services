using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SchemaBuilder.Models;
using ServiceDirectory.Common.DataStandard.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchemaBuilder.Pages
{
    [BindProperties]
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        [BindProperty]
        public List<IncludeResource> IncludeResources
        {
            get;
            set;
        }

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public async Task<ActionResult> OnPostAsync(List<IncludeResource> includeResources)
        {
            ServiceDirectory.Common.DataStandard.ResourceReader resourceReader = new ServiceDirectory.Common.DataStandard.ResourceReader("https://raw.githubusercontent.com/openreferral/specification/master/datapackage.json");
            dynamic json = await resourceReader.GetResourceJSON();
            List<dynamic> finalResources = new List<dynamic>();
            foreach (IncludeResource includeResource in includeResources)
            {
                foreach (dynamic resource in json.resources)
                {
                    if (resource.name.Value == includeResource.Name)
                    {
                        if (includeResource.IsEmpty())
                        {
                            break;
                        }
                        List<dynamic> finalFields = new List<dynamic>();
                        foreach (IncludeAttribute includeAttribute in includeResource.Attributes)
                        {
                            foreach (dynamic field in resource.schema.fields)
                            {
                                if (includeAttribute.Field == field.name.Value && includeAttribute.Include)
                                {
                                    finalFields.Add(field);
                                    break;
                                }
                            }
                        }
                        if (finalFields.Count > 0)
                        {
                            resource.schema.fields = JArray.Parse(JsonConvert.SerializeObject(finalFields.ToArray()));
                            finalResources.Add(resource);
                        }
                    }
                }
            }
            json.resources = JArray.Parse(JsonConvert.SerializeObject(finalResources.ToArray()));

            Response.Headers.Add("Content-Disposition", @"attachment; filename=data-package.json");

            return Content(JsonConvert.SerializeObject(json), "application/json");
        }

        public async Task OnGetAsync()
        {
            IncludeResources = new List<IncludeResource>();
            ServiceDirectory.Common.DataStandard.ResourceReader resourceReader = new ServiceDirectory.Common.DataStandard.ResourceReader("https://raw.githubusercontent.com/openreferral/specification/master/datapackage.json");
            List<Resource> resources = await resourceReader.GetStronglyTypesResourcesAsync();
            foreach(Resource resource in resources)
            {
                IncludeResource includeResource = new IncludeResource();
                includeResource.Name = resource.Name;
                includeResource.Attributes = new List<IncludeAttribute>();
                foreach (Field field in resource.Fields)
                {
                    includeResource.Attributes.Add(new IncludeAttribute() { Field = field.Name });
                }
                IncludeResources.Add(includeResource);
            }
        }
    }
}

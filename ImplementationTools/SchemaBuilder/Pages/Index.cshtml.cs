﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SchemaBuilder.Models;
using ServiceDirectory.Common.DataStandard.Models;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace SchemaBuilder.Pages
{
    [BindProperties]
    public class IndexModel : PageModel
    {
        private const string US_EXTENDED_DATA_PACKAGE = "https://raw.githubusercontent.com/openreferral/specification/master/datapackage.json";
        private const string UK_EXTENDED_DATA_PACKAGE = "https://raw.githubusercontent.com/OpenReferralUK/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json";
        private readonly ILogger<IndexModel> _logger;

        [BindProperty]
        public IncludeConfig Config
        {
            get;
            set;
        }

        [BindProperty]
        public IFormFile UploadedFile { get; set; }
        public List<SelectListItem> DataPackageOptions { get; set; }

        [ActivatorUtilitiesConstructor]
        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;            
        }
        public async Task<ActionResult> OnPostDowloadPackageAsync(IncludeConfig config)
        {
            PopulateDataPackageOptions();
            ServiceDirectory.Common.DataStandard.ResourceReader resourceReader = new ServiceDirectory.Common.DataStandard.ResourceReader(Config.ExtendedDataPackageURL);
            dynamic json = await resourceReader.GetResourceJSON();
            List<dynamic> finalResources = new List<dynamic>();
            foreach (IncludeResource includeResource in config.Resources)
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
        public async Task<ActionResult> OnPostDowloadConfigAsync(IncludeConfig config)
        {
            PopulateDataPackageOptions();
            Response.Headers.Add("Content-Disposition", @"attachment; filename=config.json");

            return Content(JsonConvert.SerializeObject(config), "application/json");
        }

        public async Task OnPostUploadConfigAsync()
        {
            byte[] data;
            using (MemoryStream ms = new MemoryStream())
            {
                await UploadedFile.CopyToAsync(ms);
                data = ms.ToArray();
            }
            string json = Encoding.UTF8.GetString(data);
            List<IncludeResource> includeResources = JsonConvert.DeserializeObject<List<IncludeResource>>(json);
            HashSet<string> includeProperties = new HashSet<string>();
            foreach(IncludeResource ir in includeResources)
            {
                foreach(IncludeAttribute ia in ir.Attributes)
                {
                    if (ia.Include)
                    {
                        includeProperties.Add(GetKey(ir, ia.Field));
                    }
                }
            }

            await LoadExtendedDataPackage(includeProperties);
        }

        private static string GetKey(IncludeResource ir, string fieldName)
        {
            return string.Format("{0}|{1}", ir.Name, fieldName);
        }

        public async Task OnPostAsync()
        {
            await LoadExtendedDataPackage(null);
        }

        public async Task OnGetAsync()
        {
            await LoadExtendedDataPackage(null);
        }

        private async Task LoadExtendedDataPackage(HashSet<string> includeProperties)
        {
            PopulateDataPackageOptions();
            Config = new IncludeConfig();
            if (string.IsNullOrEmpty(Config.ExtendedDataPackageURL))
            {
                Config.ExtendedDataPackageURL = US_EXTENDED_DATA_PACKAGE;
            }
            Config.Resources = new List<IncludeResource>();
            ServiceDirectory.Common.DataStandard.ResourceReader resourceReader = new ServiceDirectory.Common.DataStandard.ResourceReader(Config.ExtendedDataPackageURL);
            List<Resource> resources = await resourceReader.GetStronglyTypesResourcesAsync();
            foreach (Resource resource in resources)
            {
                IncludeResource includeResource = new IncludeResource();
                includeResource.Name = resource.Name;
                includeResource.Description = resource.Description;
                includeResource.Attributes = new List<IncludeAttribute>();
                foreach (Field field in resource.Fields)
                {
                    includeResource.Attributes.Add(new IncludeAttribute()
                    {
                        Field = field.Name,
                        Description = field.Description,
                        Type = field.Type,
                        Format = field.Format,
                        Required = field.Required,
                        Unique = field.Unique,
                        Include = (includeProperties != null && includeProperties.Contains(GetKey(includeResource, field.Name)))
                    });
                }
                Config.Resources.Add(includeResource);
            }
        }

        private void PopulateDataPackageOptions()
        {
            DataPackageOptions = new List<SelectListItem>();
            DataPackageOptions.Add(new SelectListItem
            {
                Value = US_EXTENDED_DATA_PACKAGE,
                Text = US_EXTENDED_DATA_PACKAGE
            });
            DataPackageOptions.Add(new SelectListItem
            {
                Value = UK_EXTENDED_DATA_PACKAGE,
                Text = UK_EXTENDED_DATA_PACKAGE
            });
        }
    }
}

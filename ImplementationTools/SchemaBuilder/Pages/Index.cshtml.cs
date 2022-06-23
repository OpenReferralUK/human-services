using Microsoft.AspNetCore.Http;
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
using System.Dynamic;
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
        private const string COMBINED_EXTENDED_DATA_PACKAGE = "https://raw.githubusercontent.com/OpenReferralUK/human-services/master/US-UK-Integration/combined-data-package.json";
        private const string DataPackageFileNameSuffix = "-data-package.json";
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
                        if (includeResource.IsEmpty)
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

            dynamic extension = new ExpandoObject();
            extension.name = config.ProfileName;
            extension.identifier = config.ProfileIdentifier;

            dynamic source = new ExpandoObject();
            source.url = config.ExtendedDataPackageURL;            
            
            extension.source = source;

            json.extension = JToken.FromObject(extension);
            json.version = config.Version;

            Response.Headers.Add("Content-Disposition", @"attachment; filename="+Config.FileName);

            return Content(JsonConvert.SerializeObject(json), "application/json");
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
            dynamic package = JsonConvert.DeserializeObject(json);

            if (package.extension == null || package.extension.source == null || package.extension.source.url == null)
            {
                TempData["error"] = "The required extension data is missing";
                return;
            }

            Config = new IncludeConfig();
            Config.ExtendedDataPackageURL = package.extension.source.url.Value;
            Config.ProfileIdentifier = package.extension.identifier.Value;
            Config.ProfileName = package.extension.name.Value;
            Config.Selected = true;
            Config.Version = package.version.Value;
            Config.FileName = Config.ProfileIdentifier + DataPackageFileNameSuffix;

            HashSet<string> includeProperties = new HashSet<string>();
            foreach(dynamic resource in package.resources)
            {
                foreach(dynamic field in resource.schema.fields)
                {
                    includeProperties.Add(GetKey(resource.name.Value, field.name.Value));
                }
            }

            await LoadExtendedDataPackage(includeProperties);
        }

        private static string GetKey(string resourceName, string fieldName)
        {
            return string.Format("{0}|{1}", resourceName, fieldName);
        }

        public async Task OnPostAsync()
        {
            await LoadExtendedDataPackage(null);
            Config.Selected = true;
        }

        public async Task OnGetAsync()
        {
            await LoadExtendedDataPackage(null);
        }

        private async Task LoadExtendedDataPackage(HashSet<string> includeProperties)
        {
            PopulateDataPackageOptions();
            if (Config == null)
            {
                Config = new IncludeConfig();
                Config.FileName = DataPackageFileNameSuffix;
            }
            if (string.IsNullOrEmpty(Config.ExtendedDataPackageURL))
            {
                Config.ExtendedDataPackageURL = COMBINED_EXTENDED_DATA_PACKAGE;
            }
            Config.Resources = new List<IncludeResource>();
            ServiceDirectory.Common.DataStandard.ResourceReader resourceReader = new ServiceDirectory.Common.DataStandard.ResourceReader(Config.ExtendedDataPackageURL);
            Package package = await resourceReader.GetStronglyTypesPackageAsync();
            if (string.IsNullOrEmpty(Config.Version))
            {
                Config.Version = package.Version;
            }
            Config.OriginalVersion = package.Version;
            foreach (Resource resource in package.Resources)
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
                        Include = (includeProperties != null && includeProperties.Contains(GetKey(includeResource.Name, field.Name)))
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
                Value = COMBINED_EXTENDED_DATA_PACKAGE,
                Text = COMBINED_EXTENDED_DATA_PACKAGE
            });
            DataPackageOptions.Add(new SelectListItem
            {
                Value = US_EXTENDED_DATA_PACKAGE,
                Text = US_EXTENDED_DATA_PACKAGE,
            });            
            DataPackageOptions.Add(new SelectListItem
            {
                Value = UK_EXTENDED_DATA_PACKAGE,
                Text = UK_EXTENDED_DATA_PACKAGE
            });
        }
    }
}

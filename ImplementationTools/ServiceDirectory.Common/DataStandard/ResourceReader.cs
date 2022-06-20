using ServiceDirectory.Common.DataStandard.Models;
using System;
using System.Collections.Generic;

namespace ServiceDirectory.Common.DataStandard
{
    public class ResourceReader
    {
        private string extendedDataPackage;
        private dynamic json;
        private WebServiceReader webServiceReader;

        public ResourceReader(string extendedDataPackage = "https://raw.githubusercontent.com/esd-org-uk/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json")
        {
            webServiceReader = new WebServiceReader(new APIValidatorSettings());
            this.extendedDataPackage = extendedDataPackage;
        }

        public async System.Threading.Tasks.Task<dynamic> GetResources()
        {
            dynamic json = await GetResourceJSON().ConfigureAwait(false);
            if (json != null)
            {
                return json.resources;
            }
            return json;
        }

        public async System.Threading.Tasks.Task<Package> GetStronglyTypesPackageAsync()
        {
            Package package = new Package();
            dynamic json = await GetResourceJSON().ConfigureAwait(false);
            foreach (dynamic resource in json.resources)
            {
                Resource resourceObj = new Resource();
                resourceObj.Name = resource.name.Value;
                resourceObj.Description = resource.description.Value;
                foreach(dynamic field in resource.schema.fields)
                {
                    resourceObj.Fields.Add(new Field() { Name = field.name.Value, Description = field.description.Value, Type = field.type.Value, Format = (field.format != null ? field.format.Value : null),
                    Required = (field.constraints != null && field.constraints.required != null ? field.constraints.required.Value : false),
                    Unique = (field.constraints != null && field.constraints.unique != null ? field.constraints.unique.Value : false)
                    });
                }
                package.Resources.Add(resourceObj);
            }
            package.Version = json.version;
            return package;
        }

        public async System.Threading.Tasks.Task<List<string>> GetResourceNames()
        {
            List<string> resources = new List<string>();
            dynamic json = await GetResourceJSON().ConfigureAwait(false);
            foreach (dynamic resource in json.resources)
            {
                resources.Add(resource.name.Value);
            }
            return resources;
        }

        public async System.Threading.Tasks.Task<dynamic> GetResourceJSON()
        {
            try
            {
                if (json == null)
                {
                    WebServiceResponse response = await webServiceReader.ConvertToDynamic(extendedDataPackage).ConfigureAwait(false);
                    if (response != null)
                    {
                        json = response.Data;
                    }
                }
                return json;
            }
            catch (Exception e)
            {
                throw new ServiceDirectoryException("Error reading extended data package", e);
            }
        }

    }
}

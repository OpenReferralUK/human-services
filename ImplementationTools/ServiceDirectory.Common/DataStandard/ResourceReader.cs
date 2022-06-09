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

        public async System.Threading.Tasks.Task<List<Resource>> GetStronglyTypesResourcesAsync()
        {
            List<Resource> resources = new List<Resource>();
            dynamic json = await GetResourceJSON().ConfigureAwait(false);
            foreach (dynamic resource in json.resources)
            {
                Resource resourceObj = new Resource();
                resourceObj.Name = resource.name.Value;
                foreach(dynamic field in resource.schema.fields)
                {
                    resourceObj.Fields.Add(new Field() { Name = field.name.Value });
                }
                resources.Add(resourceObj);
            }
            return resources;
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

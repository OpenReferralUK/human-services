using System;
using System.Collections.Generic;

namespace ServiceDirectory.Common.DataStandard
{
    public class ResourceReader
    {
        private const string ExtendedDataPackage = "https://raw.githubusercontent.com/esd-org-uk/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json";
        private dynamic json;
        public async System.Threading.Tasks.Task<dynamic> GetResources()
        {
            dynamic json = await GetResourceJSON().ConfigureAwait(false);
            if (json != null)
            {
                return json.resources;
            }
            return json;
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

        private async System.Threading.Tasks.Task<dynamic> GetResourceJSON()
        {
            try
            {
                if (json == null)
                {
                    WebServiceResponse response = await WebServiceReader.ConvertToDynamic(ExtendedDataPackage).ConfigureAwait(false);
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

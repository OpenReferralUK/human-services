using System.Collections.Generic;

namespace ServiceDirectory.Common
{
    public class Resources
    {
        private const string ExtendedDataPackage = "https://raw.githubusercontent.com/esd-org-uk/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json";

        public static async System.Threading.Tasks.Task<dynamic> GetResources()
        {
            dynamic json = await WebServiceReader.ConvertToDynamic(ExtendedDataPackage).ConfigureAwait(false);
            if (json != null)
            {
                return json.resources;
            }
            return json;
        }

        public static async System.Threading.Tasks.Task<List<string>> GetResourceNames()
        {
            List<string> resources = new List<string>();
            dynamic json = await WebServiceReader.ConvertToDynamic(ExtendedDataPackage).ConfigureAwait(false);
            foreach (dynamic resource in json.resources)
            {
                resources.Add(resource.name.Value);
            }
            return resources;
        }

        public static string FindResourceName(string name, List<string> resourceNames)
        {
            string lastMatch = string.Empty;
            foreach (string rName in resourceNames)
            {
                if (name.StartsWith(rName) && rName.Length > lastMatch.Length)
                {
                    lastMatch = rName;
                }
            }
            return lastMatch;
        }

        public static bool ShowItem(dynamic item)
        {
            if (item.name.Value.EndsWith("_ids"))
            {
                return false;
            }
            if (item.applicationProfile == null)
            {
                return true;
            }
            foreach (dynamic profile in item.applicationProfile)
            {
                if (profile.name == "LGA" || profile.name == "openReferral")
                {
                    return true;
                }
            }
            return false;
        }
    }
}

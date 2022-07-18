using Newtonsoft.Json.Linq;
using ServiceDirectory.Common.DataStandard;
using ServiceDirectory.Common.Pagination;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServiceDirectory.Common
{
    public class Delayering
    {
        public static async Task<DelayeredResult> DelayerPaginatedData(string apiBaseUrl, APIValidatorSettings settings = null)
        {
            settings = settings ?? new APIValidatorSettings();

            ResourceReader resourceReader = new ResourceReader();
            WebServiceReader webServiceReader = new WebServiceReader(settings);
            List<string> resourceNames = await resourceReader.GetResourceNames().ConfigureAwait(false);
            Dictionary<string, Dictionary<string, dynamic>> objectCollection = new Dictionary<string, Dictionary<string, dynamic>>();

            Paginator paginator = new Paginator();
            PaginationResults paginationResults = await paginator.GetAllServices(apiBaseUrl, string.Empty, webServiceReader, settings).ConfigureAwait(false);

            foreach (dynamic s in paginationResults.Items)
            {
                ExtractObjects(resourceNames, objectCollection, s, "service", null);
            }

            return new DelayeredResult(objectCollection, paginationResults.Hashes);
        }

        private static void ExtractObjects(List<string> resourceNames, Dictionary<string, Dictionary<string, dynamic>> objectCollection, dynamic obj, string name, Parent parent)
        {
            dynamic newObj = new System.Dynamic.ExpandoObject();
            try
            {
                foreach (var prop in obj)
                {
                    if (prop.Value.Type == null)
                    {
                        if (prop.Name.ToLower() == "parent")
                        {
                            //bit of a hack but I am not sure of a better solution
                            ExtractObjects(resourceNames, objectCollection, prop.Value, name, null);
                        }
                        else
                        {
                            Parent p = new Parent(name, prop.Value, parent);
                            Parent.SaveID(newObj, p, Resources.FindResourceName(prop.Name, resourceNames));
                            ExtractObjects(resourceNames, objectCollection, prop.Value, prop.Name, p);
                        }
                    }
                    else if (prop.Value.Type == JTokenType.Array && IsObjectArray(prop))
                    {
                        foreach (var item in prop.Value)
                        {
                            ExtractObjects(resourceNames, objectCollection, item, Resources.FindResourceName(prop.Name, resourceNames), new Parent(name, obj, parent));
                        }
                    }
                    else
                    {
                        ((IDictionary<String, Object>)newObj).Add(prop.Name, prop.Value);
                    }
                }

                if (parent != null)
                {
                    parent.AddID(newObj);
                }

                SaveObject(objectCollection, newObj, name);
            }
            catch (Exception ex)
            {
                throw new ServiceDirectoryException("Error converting the data structure into a tabular format", ex);
            }
        }

        private static void SaveObject(Dictionary<string, Dictionary<string, dynamic>> objectCollection, dynamic value, string name)
        {
            try
            {
                if (!objectCollection.ContainsKey(name))
                {
                    objectCollection.Add(name, new Dictionary<string, dynamic>());
                }
                objectCollection[name].Add(Guid.NewGuid().ToString(), value);
            }
            catch (Exception e)
            {
                throw new ServiceDirectoryException("Error saving object for the sheet", e);
            }
        }

        private static bool IsObjectArray(dynamic prop)
        {
            foreach (var item in prop.Value)
            {
                return (item.Type == null);
            }
            return false;
        }
    }
}

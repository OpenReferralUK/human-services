using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Dynamic;

namespace ServiceDirectory.Common
{
    public class Paginator
    {
        public async System.Threading.Tasks.Task<PaginationResults> GetAllServices(string apiBaseUrl)
        {
            PaginationResults paginationResults = new PaginationResults();
            
            int pageNo = 0;            

            while (pageNo < paginationResults.TotalPages)
            {
                pageNo++;

                string serviceUrl = apiBaseUrl + "/services/";
                if (apiBaseUrl.StartsWith("https://blackburn.openplace.directory"))
                {
                    //hack - temp
                    serviceUrl = apiBaseUrl + "/hservices/local/";
                }

                dynamic serviceList = await WebServiceReader.ConvertToDynamic(serviceUrl + "?page=" + pageNo);

                if (!HasProperty(serviceList, "totalElements") || !HasProperty(serviceList, "totalPages") || !HasProperty(serviceList, "number") || !HasProperty(serviceList, "size") || !HasProperty(serviceList, "first") || !HasProperty(serviceList, "last"))
                {
                    paginationResults.HasPaginationMetaData = false;
                }

                try
                {
                    paginationResults.TotalPages = Convert.ToInt32(serviceList.totalPages);
                }
                catch { }

                foreach (dynamic s in serviceList.content)
                {
                    dynamic obj = s;
                    try
                    {
                        obj = await WebServiceReader.ConvertToDynamic(apiBaseUrl + "/services/" + s.id);
                        if (obj == null)
                        {
                            obj = s;
                            paginationResults.MissingDetailIDs.Add(Convert.ToString(s.id));
                        }
                    }
                    catch
                    {
                        try
                        {
                            paginationResults.MissingDetailIDs.Add(Convert.ToString(s.id));
                        }
                        catch
                        {
                        }
                    }
                    paginationResults.Items.Add(obj);
                }
            }

            return paginationResults;
        }

        public static bool HasProperty(dynamic settings, string name)
        {
            if (settings is JObject)
            {
                return (((JObject)settings).ToObject<Dictionary<string, object>>()).ContainsKey(name);
            }
            return settings.GetType().GetProperty(name) != null;
        }
    }
}

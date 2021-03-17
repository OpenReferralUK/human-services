using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace ServiceDirectory.Common.Pagination
{
    public class Paginator
    {
        public delegate System.Threading.Tasks.Task ServiceProcessorAsync(dynamic services, int totalPages);
        public async System.Threading.Tasks.Task<PaginationResults> GetAllServices(string apiBaseUrl)
        {
            PaginationResults paginationResults = new PaginationResults();
            await PaginateServices(apiBaseUrl, async delegate (dynamic serviceList, int totalPages)
            {
                if (serviceList != null) { 

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

            });

            return paginationResults;
        }

        public async System.Threading.Tasks.Task PaginateServices(string apiBaseUrl, ServiceProcessorAsync processor, string parameters = "")
        {
            int pageNo = 0;
            int totalPages = 1;

            while (pageNo < totalPages)
            {
                pageNo++;

                string serviceUrl = apiBaseUrl + "/services/";
                if (apiBaseUrl.StartsWith("https://blackburn.openplace.directory"))
                {
                    //hack - temp
                    serviceUrl = apiBaseUrl + "/hservices/local/";
                }

                serviceUrl += parameters;

                if (!serviceUrl.Contains("?"))
                {
                    serviceUrl += "?";
                }
                else
                {
                    serviceUrl += "&";
                }

                dynamic serviceList = await WebServiceReader.ConvertToDynamic(serviceUrl + "page=" + pageNo);

                try
                {
                    totalPages = Convert.ToInt32(serviceList.totalPages);
                }
                catch { Console.WriteLine("Something went wrong "); }


                await processor(serviceList, totalPages);
            }
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

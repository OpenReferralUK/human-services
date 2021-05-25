using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServiceDirectory.Common.Pagination
{
    public class Paginator
    {
        public delegate Task ServiceProcessorAsync(dynamic services, int totalPages);

        public async Task<PaginationResults> GetServices(string apiBaseUrl, APIValidatorSettings settings = null)
        {
            settings = settings ?? new APIValidatorSettings();

            var paginationResults = new PaginationResults();

            async Task processor(dynamic serviceList, int totalPages)
            {
                if (serviceList == null)
                    return;

                if (!HasProperty(serviceList, "totalElements") || !HasProperty(serviceList, "totalPages") || !HasProperty(serviceList, "number") || !HasProperty(serviceList, "size") || !HasProperty(serviceList, "first") || !HasProperty(serviceList, "last")
                     || !HasProperty(serviceList, "content"))
                {
                    paginationResults.HasPaginationMetaData = false;
                }

                try
                {
                    paginationResults.TotalPages = Convert.ToInt32(serviceList.totalPages);
                }
                catch
                {
                    paginationResults.HasInvalidTotalPages = true;
                }

                if (HasProperty(serviceList, "content"))
                {
                    if (settings.RandomServiceOnly)
                    {
                        await ValidateRandomService(apiBaseUrl, paginationResults, serviceList);
                    }
                    else
                    {
                        foreach (dynamic s in serviceList.content)
                        {
                            await ValidateService(apiBaseUrl, paginationResults, s);
                        }
                    }
                }
            }

            await PaginateServices(apiBaseUrl, processor, totalPagesOverride: settings.FirstPageOnly ? 1 : (int?)null);

            return paginationResults;
        }

        private static async Task<string> ValidateRandomService(string apiBaseUrl, PaginationResults paginationResults, dynamic serviceList)
        {
            var service = GetRandomService(serviceList);

            if (service == null)
                return null; // maybe a message is required

            await ValidateService(apiBaseUrl, paginationResults, service);

            return Convert.ToString(service.id ?? null);
        }

        private static dynamic GetRandomService(dynamic serviceList)
        {
            var services = new List<dynamic>();

            foreach (dynamic s in serviceList.content)
            {
                services.Add(s);
            }

            if (services.Count == 0)
                return null;

            var random = new Random();
            var index = random.Next(0, services.Count);
            var service = services[index];

            return service;
        }

        public async Task<PaginationResults> GetAllServices(string apiBaseUrl)
        {
            return await GetServices(apiBaseUrl);
        }

        private static async Task ValidateService(string apiBaseUrl, PaginationResults paginationResults, dynamic service)
        {
            dynamic obj = service;

            try
            {
                obj = await WebServiceReader.ConvertToDynamic(apiBaseUrl + "/services/" + service.id);
                
                if (obj == null)
                {
                    obj = service;
                    paginationResults.MissingDetailIDs.Add(Convert.ToString(service.id));
                }
            }
            catch
            {
                try
                {
                    paginationResults.MissingDetailIDs.Add(Convert.ToString(service.id));
                }
                catch
                {
                    //bad data don't stop the test for this
                }
            }

            paginationResults.Items.Add(obj);
        }

        public async Task PaginateServices(string apiBaseUrl, ServiceProcessorAsync processor, string parameters = "", int? totalPagesOverride = null)
        {
            int pageNo = 0;
            int totalPages = totalPagesOverride ?? 1;

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

                if (!totalPagesOverride.HasValue)
                {
                    try
                    {
                        totalPages = Convert.ToInt32(serviceList.totalPages);
                    }
                    catch
                    {
                        //if this isn't here we will ignore it and just paginate the first page. This issue will be reported upon in pagination 
                    }
                }

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

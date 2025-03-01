﻿using Newtonsoft.Json.Linq;
using ServiceDirectory.Common.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServiceDirectory.Common.Pagination
{
    public class Paginator
    {
        public delegate Task<bool> ServiceProcessorAsync(dynamic services, int totalPages, int hash);

        private const int SampleSize = 10;
        private readonly string[] requiredProperties = new[] { "totalElements", "totalPages", "number", "size", "first", "last", "content" };

        private string[] GetMissingPaginationMetadata(dynamic serviceList)
        {
            var missing = new List<string>();

            foreach (var requiredProperty in requiredProperties)
            {
                if (HasProperty(serviceList, requiredProperty))
                    continue;
                missing.Add(requiredProperty);
            }

            return missing.ToArray();
        }

        public async Task<PaginationResults> GetServices(string apiBaseUrl, string id, WebServiceReader webServiceReader, APIValidatorSettings settings = null)
        {
            settings = settings ?? new APIValidatorSettings();

            var paginationResults = new PaginationResults();

            async Task<bool> processor(dynamic serviceList, int totalPages, int hash)
            {
                if (serviceList == null)
                    return true;

                paginationResults.MissingPaginationMetaData = GetMissingPaginationMetadata(serviceList);
                paginationResults.Hashes.Add(hash);

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
                        await ValidateRandomService(apiBaseUrl, paginationResults, serviceList, webServiceReader);
                    }
                    else
                    {
                        List<dynamic> services = new List<dynamic>();
                        foreach (dynamic s in serviceList.content)
                        {
                            if (HasProperty(s, "taxonomies") && HasProperty(s, "regular_schedules"))
                            {
                                //the service data is all in the list so no need to go deeper.
                                paginationResults.Items.Add(s);
                                continue;
                            }
                            services.Add(s);
                        }

                        Parallel.ForEach(services, (s) =>
                        {
                            ValidateService(apiBaseUrl, paginationResults, s, webServiceReader).GetAwaiter().GetResult();
                        });
                    }
                }

                return true;
            }

            int? maximumPages = null;
            if (settings != null && settings.SamplePages)
            {
                maximumPages = SampleSize;
            }

            await PaginateServices(apiBaseUrl, id, processor, webServiceReader, string.Empty, settings.FirstPageOnly ? 1 : maximumPages, settings);

            return paginationResults;
        }

        private static async Task<string> ValidateRandomService(string apiBaseUrl, PaginationResults paginationResults, dynamic serviceList, WebServiceReader webServiceReader)
        {
            var service = GetRandomService(serviceList);

            if (service == null)
                return null; // maybe a message is required

            await ValidateService(apiBaseUrl, paginationResults, service, webServiceReader);

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

        public async Task<PaginationResults> GetAllServices(string apiBaseUrl, string id, WebServiceReader webServiceReader, APIValidatorSettings settings)
        {
            return await GetServices(apiBaseUrl, id, webServiceReader, settings);
        }

        private static async Task ValidateService(string apiBaseUrl, PaginationResults paginationResults, dynamic service, WebServiceReader webServiceReader)
        {
            dynamic obj = service;

            try
            {
                WebServiceResponse result = await webServiceReader.ConvertToDynamic(apiBaseUrl + "/services/" + service.id);
                
                if (result != null)
                {
                    obj = result.Data;
                    paginationResults.HasAllowOrigin = result.HasAllowOrigin;
                }

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

        public async Task PaginateServices(string apiBaseUrl, string id, ServiceProcessorAsync processor, WebServiceReader webServiceReader, string parameters = "", int? totalPagesOverride = null, APIValidatorSettings settings = null)
        {
            int pageNo = 0;
            int totalPages = totalPagesOverride ?? 1;

            while (pageNo < totalPages)
            {
                pageNo++;

                string serviceUrl = apiBaseUrl + "/services/";

                serviceUrl += parameters;

                if (!serviceUrl.Contains("?"))
                {
                    serviceUrl += "?";
                }
                else
                {
                    serviceUrl += "&";
                }

                serviceUrl += "page=" + pageNo;

                if (settings != null && settings.LargePerPages)
                {
                    serviceUrl += "&per_page=1000";
                }

                WebServiceResponse serviceList = await webServiceReader.ConvertToDynamic(serviceUrl);

                try
                {
                    if (serviceList == null)
                    {
                        continue;
                    }
                    int tmp = Convert.ToInt32(serviceList.Data.totalPages);
                    if (!totalPagesOverride.HasValue || tmp < totalPages)
                    {
                        totalPages = tmp;
                    }
                }
                catch
                {
                    //if this isn't here we will ignore it and just paginate the first page. This issue will be reported upon in pagination 
                }                

                if (!await processor(serviceList.Data, totalPages, serviceList.HashCode))
                {
                    break;
                }

                ProgressCache.Update(id, pageNo, totalPages);
            }
        }

        public static bool HasProperty(dynamic settings, string name)
        {
            if (settings is JObject)
            {
                var dictionary = ((JObject)settings).ToObject<Dictionary<string, object>>();

                //return dictionary.Keys.Select(k => k.ToUpperInvariant()).Contains(name.ToUpperInvariant());

                return dictionary.ContainsKey(name);
            }
            return settings.GetType().GetProperty(name) != null;
        }
    }
}

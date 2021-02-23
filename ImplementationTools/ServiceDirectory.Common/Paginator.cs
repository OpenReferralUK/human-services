using System;

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
    }
}

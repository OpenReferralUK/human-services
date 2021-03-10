using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;

namespace ServiceDirectory.Common.FeatureTests
{
    public class RegularScheduleTest : IFeatureTest
    {
        internal string validFrom;
        internal string validTo;
        internal string closesAt;
        internal string opensAt;
        internal string day;
        private string serviceId;

        public RegularScheduleTest(string serviceId)
        {
            this.serviceId = serviceId;
        }
        public string Name { get { return "Time Search Test"; } }

        public string Parameters
        {
            get
            {
                List<string> parameters = new List<string>();
                if (!string.IsNullOrEmpty(opensAt))
                {
                    parameters.Add("start_time=" + HttpUtility.UrlEncode(opensAt));
                }
                if (!string.IsNullOrEmpty(closesAt))
                {
                    parameters.Add("end_time=" + HttpUtility.UrlEncode(closesAt));
                }
                if (!string.IsNullOrEmpty(day))
                {
                    parameters.Add("day=" + HttpUtility.UrlEncode(day));
                }
                return "?" + string.Join("&", parameters);
            }
        }

        public bool IsValid()
        {
            if (!string.IsNullOrEmpty(validTo))
            {
                DateTime validToDate;
                if (!DateTime.TryParse(validTo, out validToDate))
                {
                    return false;
                }
                if (validToDate < DateTime.Now)
                {
                    return false;
                }
            }
            if (!string.IsNullOrEmpty(validFrom))
            {
                DateTime validFromDate;
                if (!DateTime.TryParse(validFrom, out validFromDate))
                {
                    return false;
                }
                if (validFromDate > DateTime.Now)
                {
                    return false;
                }
            }
            return !string.IsNullOrEmpty(day) || !string.IsNullOrEmpty(closesAt) || !string.IsNullOrEmpty(opensAt);
        }

        public int CompareTo(object obj)
        {
            if (!(obj is RegularScheduleTest))
            {
                return 0;
            }
            return GenerateRichnessScore((RegularScheduleTest)obj).CompareTo(GenerateRichnessScore(this));
        }

        private int GenerateRichnessScore(RegularScheduleTest obj)
        {
            if (obj == null)
            {
                return 0;
            }
            int score = 0;
            if (!string.IsNullOrEmpty(opensAt))
            {
                score++;
            }
            if (!string.IsNullOrEmpty(closesAt))
            {
                score++;
            }
            if (!string.IsNullOrEmpty(day))
            {
                score++;
            }
            return score;
        }

        public async Task<bool> Execute(string apiBaseUrl)
        {
            bool result = false;
            Paginator paginator = new Paginator();
            try
            {
                await paginator.PaginateServices(apiBaseUrl, async delegate (dynamic serviceList, int totalPages)
                {
                    if (serviceList == null)
                    {
                        result = false;
                    }
                    foreach (dynamic s in serviceList.content)
                    {
                        if (s != null && Convert.ToString(s.id.Value) == serviceId)
                        {
                            result = true;
                        }
                    }
                }, Parameters);
            }
            catch
            {
                return false;
            }
            return result;
        }
    }
}

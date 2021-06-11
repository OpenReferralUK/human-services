using System;
using System.Collections.Generic;
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

        public RegularScheduleTest(string serviceId)
        {
            ServiceID = serviceId;
        }

        public static string TestName = "Time Search Test";

        public string Name { get { return TestName; } }

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

        public string ServiceID { get; private set; }

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
    }
}

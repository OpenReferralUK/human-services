using System.Collections.Generic;
using System.Web;

namespace ServiceDirectory.Common.FeatureTests
{
    public class AgeTest : IFeatureTest
    {
        internal string minAge;
        internal string maxAge;

        public AgeTest(string serviceId)
        {
            ServiceID = serviceId;
        }
        public string Name { get { return "Age Test"; } }

        public string Parameters
        {
            get
            {
                List<string> parameters = new List<string>();
                if (!string.IsNullOrEmpty(minAge))
                {
                    parameters.Add("minimum_age=" + HttpUtility.UrlEncode(minAge));
                }
                if (!string.IsNullOrEmpty(maxAge))
                {
                    parameters.Add("maximum_age=" + HttpUtility.UrlEncode(maxAge));
                }
                return "?" + string.Join("&", parameters);
            }
        }

        public string ServiceID { get; private set; }

        public bool IsValid()
        {
            return !string.IsNullOrEmpty(minAge) || !string.IsNullOrEmpty(maxAge);
        }

        public int CompareTo(object obj)
        {
            if (!(obj is AgeTest))
            {
                return 0;
            }
            return GenerateRichnessScore((AgeTest)obj).CompareTo(GenerateRichnessScore(this));
        }

        private int GenerateRichnessScore(AgeTest obj)
        {
            if (obj == null)
            {
                return 0;
            }
            int score = 0;
            if (!string.IsNullOrEmpty(minAge))
            {
                score++;
            }
            if (!string.IsNullOrEmpty(maxAge))
            {
                score++;
            }
            return score;
        }
    }
}

using System.Web;

namespace ServiceDirectory.Common.FeatureTests
{
    public class TextTest : IFeatureTest
    {
        private string text;

        public TextTest(string text, string serviceId)
        {
            this.text = text;
            ServiceID = serviceId;
        }

        public static string TestName = "Text Test";

        public string Name { get { return TestName; } }

        public string Parameters
        {
            get { return "?text=" + HttpUtility.UrlEncode(text); }
        }

        public string ServiceID { get; private set; }

        public int CompareTo(object obj)
        {
            return 0;
        }
    }
}

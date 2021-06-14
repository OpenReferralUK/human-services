using ServiceDirectory.Common.FeatureTests;

namespace ServiceDirectory.Common.Results
{
    public class TestResult : ITestResult
    {
        public IFeatureTest Test { get; set; }

        public string NoTestName { get; set; }

        public string TestName
        {
            get
            {
                if (Test != null)
                    return Test.Name;
                return NoTestName;
            }
        }

        public bool Success { get; set; }

        public string ErrorMessage { get; set; }
    }
}
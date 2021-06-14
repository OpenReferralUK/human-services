namespace ServiceDirectory.Common.Results
{
    public class BasicTestResult : ITestResult
    {
        public string TestName { get; set; }

        public bool Success { get; set; }

        public string ErrorMessage { get; set; }
    }
}
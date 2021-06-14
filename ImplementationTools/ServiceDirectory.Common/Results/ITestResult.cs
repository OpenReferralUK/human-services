namespace ServiceDirectory.Common.Results
{
    public interface ITestResult
    {
        string TestName { get; }

        bool Success { get; }

        string ErrorMessage { get; }
    }
}

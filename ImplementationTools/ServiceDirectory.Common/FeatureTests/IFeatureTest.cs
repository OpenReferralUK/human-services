namespace ServiceDirectory.Common.FeatureTests
{
    public interface IFeatureTest
    {
        System.Threading.Tasks.Task<bool> Execute(string apiBaseUrl);
        string Name { get; }
        string Parameters { get; }
    }
}

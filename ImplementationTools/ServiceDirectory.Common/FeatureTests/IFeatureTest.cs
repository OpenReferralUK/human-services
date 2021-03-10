using System;

namespace ServiceDirectory.Common.FeatureTests
{
    public interface IFeatureTest : IComparable
    {
        System.Threading.Tasks.Task<bool> Execute(string apiBaseUrl);
        string Name { get; }
        string Parameters { get; }
    }
}

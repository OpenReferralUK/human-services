using System;

namespace ServiceDirectory.Common.FeatureTests
{
    public interface IFeatureTest : IComparable
    {
        string Name { get; }
        string Parameters { get; }
        string ServiceID { get; }
    }
}

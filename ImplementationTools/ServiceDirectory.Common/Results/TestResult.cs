using ServiceDirectory.Common.FeatureTests;

public class TestResult
{ 
    public IFeatureTest Test { get; set; }
    
    public bool Success { get; set; }

    public string ErrorMessage { get; set; }
}
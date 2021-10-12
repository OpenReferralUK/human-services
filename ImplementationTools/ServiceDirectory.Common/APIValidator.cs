using Microsoft.CSharp.RuntimeBinder;
using Newtonsoft.Json.Linq;
using ServiceDirectory.Common.Cache;
using ServiceDirectory.Common.DataStandard;
using ServiceDirectory.Common.FeatureTests;
using ServiceDirectory.Common.Pagination;
using ServiceDirectory.Common.Results;
using ServiceDirectory.Common.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ServiceDirectory.Common
{
    public class APIValidator
    {
        static readonly Random rand = new Random();

        public static async Task<ValidationResult> Validate(string baseUrl, string id, APIValidatorSettings settings = null)
        {            
            settings = settings ?? new APIValidatorSettings();

            if (string.IsNullOrEmpty(baseUrl))
            {
                return new ValidationResult() { Error = "Invalid base URL" };
            }

            if (!Uri.TryCreate(baseUrl, UriKind.Absolute, out _))
            {
                return new ValidationResult() { Error = "Invalid base URL" };
            }

            WebServiceReader webServiceReader = new WebServiceReader(settings);
            var result = new ValidationResult();

            try
            {
                var paginator = new Paginator();
                var paginationResults = await paginator.GetServices(baseUrl, id, webServiceReader, settings);

                result.IsUp = true;
                result.IsServiceFound = paginationResults.Items.Count > 0;

                if (paginationResults.Items.Count == 0)
                {
                    result.HasPagination = false;
                }

                result.HasDetailPage = (paginationResults.MissingDetailIDs.Count != paginationResults.Items.Count || paginationResults.Items.Count == 0);
                result.MissingPaginationMetaData = paginationResults.MissingPaginationMetaData;
                result.HasInvalidTotalPages = paginationResults.HasInvalidTotalPages;

                if (paginationResults.Items.Count > 0)
                {
                    var items = paginationResults.Items;
                    result.RandomServiceIdentifier = items.ElementAt(rand.Next(items.Count)).id; 
                }

                ResourceReader resourceReader = new ResourceReader();
                List<string> resourceNames = await resourceReader.GetResourceNames().ConfigureAwait(false);
                List<IFeatureTest> featureTests = new List<IFeatureTest>();
                Dictionary<string, Resource> allRequired = GetFields(await resourceReader.GetResources().ConfigureAwait(false));

                foreach (var item in paginationResults.Items)
                {
                    ValidateItems(item, resourceNames, allRequired);
                    featureTests = FindFeatureTests(item, resourceNames, featureTests, allRequired);
                }

                foreach (KeyValuePair<string, Resource> kvp in allRequired)
                {
                    result.AddResourceCount(kvp.Value);

                    if (!kvp.Value.Exists)
                    {
                        continue;
                    }

                    foreach (Field field in kvp.Value.Fields)
                    {
                        if (field.IsRequired && field.Count == 0)
                        {
                            result.MissingRequiredFields.Add(kvp.Key + "." + field.Name);
                        }
                        if (field.IsUnique && field.Values.Distinct().Count() != field.Values.Count())
                        {
                            result.InvalidUniqueFields.Add(kvp.Key + "." + field.Name);
                        }
                        if (!field.IsValidFormat())
                        {
                            result.InvalidFormats.Add(kvp.Key + "." + field.Name + " should be in " + field.Format + " format");
                        }
                        if (!field.IsValidDataType())
                        {
                            result.InvalidDataTypes.Add(kvp.Key + "." + field.Name + " should be in the " + field.DataType + " data type");
                        }
                        if (!field.IsValidEnum())
                        {
                            result.InvalidValues.Add(kvp.Key + "." + field.Name + " should be one of the following values " + string.Join(", ", field.AllowedValues));
                        }
                    }
                }

                result.Level2Results = await RunLevel2Tests(baseUrl, result, featureTests, webServiceReader);
            }
            catch(ServiceDirectoryException e)
            {
                result.Error = e.Message;
                result.SetException(e);
            }
            catch (Exception e)
            {
                result.Error = e.Message;
                result.SetException(e);
            }

            try
            {
                result.PerformFinalReview();
                return result;
            }
            catch (Exception e)
            {
                result.Error = e.Message;
                result.SetException(e);
                return result;
            }
        }

        public static Progress Progress(string id)
        {
            return ProgressCache.Get(id);
        }
        private static async Task<List<TestResult>> RunLevel2Tests(string baseUrl, ValidationResult result, List<IFeatureTest> featureTests, WebServiceReader webServiceReader)
        {
            featureTests.Sort();
            var testTypesRun = new HashSet<string>();
            var testResults = new List<TestResult>();

            foreach (IFeatureTest test in featureTests)
            {
                if (testTypesRun.Contains(test.Name))
                    continue;

                var testResult = new TestResult { Test = test };
                testResults.Add(testResult);

                if (!await TestRunner.HasPassed(baseUrl, test, webServiceReader))
                {
                    var message = string.Format("{0} failed. When tested using /services{1}", test.Name, test.Parameters);
                    result.ApiIssuesLevel2.Add(message);
                    testResult.ErrorMessage = message;
                }
                else
                {
                    testResult.Success = true;
                }

                result.Level2TestsRun++;
                testTypesRun.Add(test.Name);
            }

            return testResults;
        }

        private static List<IFeatureTest> FindFeatureTests(dynamic item, List<string> resourceNames, List<IFeatureTest> featureTests, Dictionary<string, Resource> allRequired, string resourceName = "service", string serviceId = null)
        {
            if (resourceName == "service" && string.IsNullOrEmpty(serviceId))
            {
                if (item != null)
                {
                    try
                    {
                        serviceId = Convert.ToString(item.id.Value);
                    }
                    catch (RuntimeBinderException)
                    {
                        // id doesn't exist
                        // ignore error
                    }
                }
            }

            string currentItemType = item.GetType().Name;
            string currentPropName = "";
            object currentPropValue = null;

            try
            {
                RegularScheduleTest regularScheduleTest = null;
                TaxonomyTest taxonomyTest = null;
                AgeTest ageTest = null;
                foreach (var prop in item)
                {
                    currentPropName = prop.Name;
                    currentPropValue = prop.Value;

                    if (prop.Value.Type == null)
                    {
                        FindFeatureTests(prop.Value, resourceNames, featureTests, allRequired, Resources.FindResourceName(prop.Name, resourceNames), serviceId);
                    }
                    else if (prop.Value.Type == JTokenType.Array)
                    {
                        foreach (var arrayItem in prop.Value)
                        {
                            if (arrayItem is JValue)
                                continue; // not currently validating arrays of floats / strings etc

                            FindFeatureTests(arrayItem, resourceNames, featureTests, allRequired, Resources.FindResourceName(prop.Name, resourceNames), serviceId);
                        }
                    }
                    else
                    {
                        if (allRequired.ContainsKey(resourceName))
                        {
                            if (resourceName == "physical_address")
                            {
                                if (prop.Name == "postal_code")
                                {
                                    if (prop.Value != null)
                                    {
                                        try
                                        {
                                            string val = Convert.ToString(prop.Value.Value);
                                            if (string.IsNullOrEmpty(val) || string.IsNullOrWhiteSpace(val) || !Regex.IsMatch(val, "(GIR 0AA)|((([A-Z-[QVX]][0-9][0-9]?)|(([A-Z-[QVX]][A-Z-[IJZ]][0-9][0-9]?)|(([A-Z-[QVX]][0-9][A-HJKSTUW])|([A-Z-[QVX]][A-Z-[IJZ]][0-9][ABEHMNPRVWXY])))) [0-9][A-Z-[CIKMOV]]{2})", RegexOptions.Compiled | RegexOptions.IgnoreCase))
                                            {
                                                continue;
                                            }
                                            featureTests.Add(new PostCodeTest(val, serviceId));
                                        }
                                        catch (Exception e)
                                        {
                                            //this shouldn't stop tests ignore error
                                        }
                                    }
                                }
                            }
                            else if (resourceName == "regular_schedule")
                            {
                                if (regularScheduleTest == null)
                                {
                                    regularScheduleTest = new RegularScheduleTest(serviceId);
                                }
                                if (prop.Name == "valid_from")
                                {
                                    regularScheduleTest.validFrom = Convert.ToString(prop.Value.Value);
                                }
                                if (prop.Name == "valid_to")
                                {
                                    regularScheduleTest.validTo = Convert.ToString(prop.Value.Value);
                                }
                                if (prop.Name == "opens_at")
                                {
                                    regularScheduleTest.opensAt = Convert.ToString(prop.Value.Value);
                                }
                                if (prop.Name == "closes_at")
                                {
                                    regularScheduleTest.closesAt = Convert.ToString(prop.Value.Value);
                                }
                                if (prop.Name == "byday")
                                {
                                    regularScheduleTest.day = Convert.ToString(prop.Value.Value);
                                }
                            }
                            else if (resourceName == "taxonomy")
                            {
                                if (taxonomyTest == null)
                                {
                                    taxonomyTest = new TaxonomyTest(serviceId);
                                }
                                if (prop.Name == "id")
                                {
                                    taxonomyTest.id = Convert.ToString(prop.Value.Value);
                                }
                                if (prop.Name == "vocabulary")
                                {
                                    taxonomyTest.vocabulary = Convert.ToString(prop.Value.Value);
                                }
                            }
                            else if (resourceName == "eligibility")
                            {
                                if (ageTest == null)
                                {
                                    ageTest = new AgeTest(serviceId);
                                }
                                if (prop.Name == "minimum_age")
                                {
                                    ageTest.minAge = Convert.ToString(prop.Value.Value);
                                }
                                if (prop.Name == "maximum_age")
                                {
                                    ageTest.maxAge = Convert.ToString(prop.Value.Value);
                                }
                            }
                            else if (resourceName == "service")
                            {
                                if (prop.Name == "name")
                                {
                                    if (prop.Value != null)
                                    {
                                        try
                                        {
                                            string val = Convert.ToString(prop.Value.Value);
                                            if (string.IsNullOrEmpty(val) || string.IsNullOrWhiteSpace(val) || string.IsNullOrEmpty(val.Trim()))
                                            {
                                                continue;
                                            }
                                            featureTests.Add(new TextTest(val, serviceId));
                                        }
                                        catch (Exception e)
                                        {
                                            //this shouldn't stop tests ignore error
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (regularScheduleTest != null && regularScheduleTest.IsValid())
                {
                    featureTests.Add(regularScheduleTest);
                }
                if (taxonomyTest != null && taxonomyTest.IsValid())
                {
                    featureTests.Add(taxonomyTest);
                }
                if (ageTest != null && ageTest.IsValid())
                {
                    featureTests.Add(ageTest);
                }
            }
            catch (Exception e)
            {
                var message = $"{currentItemType}; {currentPropName}; {(currentPropValue == null ? "null" : currentPropValue.ToString())}";

                throw new ServiceDirectoryException($"An error occured, trying to perform level 2 test; {message}", e);
            }

            return featureTests;
        }

        private static void ValidateItems(dynamic item, List<string> resourceNames, Dictionary<string, Resource> allRequired, string resourceName = "service", string serviceId = null)
        {
            if (allRequired.ContainsKey(resourceName))
            {
                Resource resource = allRequired[resourceName];
                resource.Count++;
            }

            try
            {
                foreach (var prop in item)
                {
                    if (prop.Value.Type == null)
                    {
                        ValidateItems(prop.Value, resourceNames, allRequired, Resources.FindResourceName(prop.Name, resourceNames));
                    }
                    else if (prop.Value.Type == JTokenType.Array)
                    {
                        foreach (var arrayItem in prop.Value)
                        {
                            if (arrayItem is JValue)
                                continue; // not currently validating arrays of floats / strings etc

                            ValidateItems(arrayItem, resourceNames, allRequired, Resources.FindResourceName(prop.Name, resourceNames));
                        }
                    }
                    else
                    {
                        if (allRequired.ContainsKey(resourceName))
                        {
                            Resource resource = allRequired[resourceName];
                            resource.Exists = true;
                            foreach (Field requiredField in resource.Fields)
                            {
                                if (requiredField.Name == prop.Name)
                                {
                                    requiredField.Count++;
                                    if (prop.Value.Type != null && prop.Value.Type != JTokenType.Array)
                                    {
                                        if (prop.Value != null)
                                        {
                                            try
                                            {
                                                requiredField.Values.Add(Convert.ToString(prop.Value.Value));
                                            }
                                            catch (Exception e)
                                            {
                                                //the test shouldn't stop if theres an error 
                                            }
                                        }
                                        else
                                        {
                                            requiredField.Values.Add(string.Empty);
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e){
                throw new ServiceDirectoryException("An error occured, trying to validate items", e);
            }
        }

        private static Dictionary<string, Resource> GetFields(dynamic resources)
        {
            Dictionary<string, Resource> allRequired = new Dictionary<string, Resource>();
            foreach (dynamic resource in resources)
            {
                if (!Resources.ShowItem(resource) || resource.name.Value == "metadata" || resource.name.Value == "meta_table_description")
                {
                    continue;
                }
                Resource requiredResource = new Resource(resource.name.Value);
                foreach (dynamic field in resource.schema.fields)
                {
                    if (!Resources.ShowItem(field) || field.name.Value.EndsWith("_id"))
                    {
                        continue;
                    }
                    bool isRequired = false;
                    bool isUnique = false;
                    if (field.constraints != null && field.constraints.required != null && field.constraints.required.Value)
                    {
                        isRequired = true;
                    }
                    if (field.constraints != null && field.constraints.unique != null && field.constraints.unique.Value)
                    {
                        isUnique = true;                        
                    }
                    HashSet<string> enums = new HashSet<string>();
                    if (field.constraints != null && field.constraints.@enum != null)
                    {
                        foreach (string enumVal in field.constraints.@enum)
                        {
                            enums.Add(enumVal);
                        }
                    }
                    string format = string.Empty;
                    if (field.format != null)
                    {
                        format = field.format.Value;
                    }
                    string dataType = string.Empty;
                    if (field.type != null)
                    {
                        dataType = field.type.Value;
                    }
                    requiredResource.AddField(new Field(field.name.Value, format, dataType, isRequired, isUnique, enums));
                }
                allRequired.Add(resource.name.Value, requiredResource);
            }
            return allRequired;
        }
    }
}

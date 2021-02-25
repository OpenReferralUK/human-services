using Newtonsoft.Json.Linq;
using ServiceDirectory.Common.Results;
using ServiceDirectory.Common.Validation;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ServiceDirectory.Common
{
    public class APIValidator
    {
        public static async System.Threading.Tasks.Task<ValidationResult> Validate(string baseUrl)
        {
            if (string.IsNullOrEmpty(baseUrl))
            {
                return new ValidationResult() { Error = "Invalid base URL" };
            }

            Uri tmpUri;
            if (!Uri.TryCreate(baseUrl, UriKind.Absolute, out tmpUri))
            {
                return new ValidationResult() { Error = "Invalid base URL" };
            }

            try
            {
                ValidationResult result = new ValidationResult();
                Paginator paginator = new Paginator();
                PaginationResults paginationResults = await paginator.GetAllServices(baseUrl);
                if (paginationResults.Items.Count == 0)
                {
                    result.HasPagination = false;
                }
                result.HasDetailPage = !(paginationResults.MissingDetailIDs.Count == paginationResults.Items.Count);

                List<string> resourceNames = await Resources.GetResourceNames();
                Dictionary<string, Resource> allRequired = GetFields(await Resources.GetResources());

                foreach (var item in paginationResults.Items)
                {
                    ValidateItems(item, resourceNames, allRequired);
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

                return result;
            }
            catch (Exception e)
            {
                return new ValidationResult() { Error = "An error occured, test aborted." };
            }
        }

        private static void ValidateItems(dynamic item, List<string> resourceNames, Dictionary<string, Resource> allRequired, string resourceName = "service")
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
            catch { }
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

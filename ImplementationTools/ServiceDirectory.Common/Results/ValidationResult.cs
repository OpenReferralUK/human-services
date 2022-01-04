using ServiceDirectory.Common.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ServiceDirectory.Common.Results
{
    public class ValidationResult
    {
        public bool IsUp { get; set; }
        public bool IsServiceFound { get; set; }
        public bool HasDetailPage { get; set; }
        public bool HasPagination { get; set; }
        public string[] MissingPaginationMetaData { get; set; }
        public bool HasPaginationMetaData
        {
            get
            {
                return MissingPaginationMetaData == null || MissingPaginationMetaData.Length == 0;
            }
        }
        public bool Level1Pass { get; private set; }
        public bool Level2Pass { get; private set; }
        public int Level2TestsRun { get; set; }
        public List<TestResult> Level2Results { get; set; } = new List<TestResult>();
        public bool HasInvalidTotalPages { get; set; }
        public string Error { get; set; }
        public List<string> MissingRequiredFields { get; set; }
        public List<string> InvalidUniqueFields { get; set; }
        public List<string> InvalidFormats { get; set; }
        public List<string> InvalidDataTypes { get; set; }
        public List<string> InvalidValues { get; set; }
        public List<string> ApiIssuesLevel1 { get; set; }
        public List<string> ApiIssuesLevel2 { get; set; }
        public string RandomServiceIdentifier { get; set; }
        public IEnumerable<string> ApiIssues
        {
            get
            {
                if (ApiIssuesLevel1 == null && ApiIssuesLevel2 == null)
                    return null;
                return (ApiIssuesLevel1 ?? new List<string>()).Union(ApiIssuesLevel2 ?? new List<string>());
            }
        }
        public List<ResourceCount> ResourceCounts { get; set; }
        private Exception exception;

        public ValidationResult()
        {
            IsUp = false;
            IsServiceFound = false;
            HasPagination = true;
            HasDetailPage = true;
            ApiIssuesLevel1 = new List<string>();
            ApiIssuesLevel2 = new List<string>();
            MissingRequiredFields = new List<string>();
            InvalidUniqueFields = new List<string>();
            InvalidFormats = new List<string>();
            InvalidDataTypes = new List<string>();
            InvalidValues = new List<string>();
            ResourceCounts = new List<ResourceCount>();
        }

        public Exception GetException()
        {
            return exception;
        }

        public void SetException(Exception e)
        {
            exception = e;
        }

        public void PerformFinalReview()
        {
            if (!HasPagination)
            {
                ApiIssuesLevel1.Add("A paginatable service method is not present. Of the form /services?page={nn}");
            }
            if (!HasDetailPage)
            {
                ApiIssuesLevel1.Add("Missing search detail pages. It should be findable under /services/{id}");
            }
            if (!HasPaginationMetaData)
            {
                ApiIssuesLevel1.Add($"Missing search method paginaton metadata at the begining of the JSON payload. Required: {string.Join("; ", MissingPaginationMetaData.Select(f => $"\"{f}\""))}. It is case sensitive, and should be in the following format: {{\"totalElements\":nn,\"totalPages\":nn,\"number\":nn,\"size\":nn,\"first\":bb,\"last\":bb\",\"content\":[{{}},{{}}]...");
            }
            if (HasInvalidTotalPages)
            {
                ApiIssuesLevel1.Add("The totalPages pagination attribute should be in a number format");
            }
            Level1Pass = HasDetailPage && HasPagination && HasPaginationMetaData;
            Level2Pass = Level1Pass && ApiIssuesLevel2.Count == 0 && Level2TestsRun > 0;
        }

        public void AddResourceCount(Resource resource)
        {
            ResourceCounts.Add(new Results.ResourceCount(resource));
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            foreach (string issue in ApiIssues)
            {
                sb.Append(issue);
                sb.AppendLine();
            }
            foreach(string field in MissingRequiredFields)
            {
                sb.Append("Missing required fields: ");
                sb.Append(field);
                sb.AppendLine();
            }
            foreach (string field in InvalidUniqueFields)
            {
                sb.Append("Invalid unique fields: ");
                sb.Append(field);
                sb.AppendLine();
            }
            foreach (string format in InvalidFormats)
            {
                sb.Append(format);
                sb.AppendLine();
            }
            foreach (string dataTypes in InvalidDataTypes)
            {
                sb.Append(dataTypes);
                sb.AppendLine();
            }
            foreach (string invalidValue in InvalidValues)
            {
                sb.Append(invalidValue);
                sb.AppendLine();
            }
            foreach (ResourceCount count in ResourceCounts)
            {
                sb.Append(count.Name);
                sb.Append(" count: ");
                sb.Append(count.Count);
                sb.AppendLine();
            }
            return sb.ToString();
        }
    }
}

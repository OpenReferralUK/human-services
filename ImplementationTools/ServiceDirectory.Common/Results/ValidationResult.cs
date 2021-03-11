using ServiceDirectory.Common.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceDirectory.Common.Results
{
    public class ValidationResult
    {
        public bool HasDetailPage { get; set; }
        public bool HasPagination { get; set; }
        public bool HasPaginationMetaData { get; set; }
        public bool Level1Pass { get; private set; }
        public bool Level2Pass { get; private set; }
        public int Level2TestsRun { get; set; }
        public string Error { get; set; }
        public List<string> MissingRequiredFields { get; set; }
        public List<string> InvalidUniqueFields { get; set; }
        public List<string> InvalidFormats { get; set; }
        public List<string> InvalidDataTypes { get; set; }
        public List<string> InvalidValues { get; set; }
        public List<string> ApiIssues { get; set; }
        internal List<string> ApiIssuesLevel2 { get; set; }

        public List<ResourceCount> ResourceCounts { get; set; }

        public ValidationResult()
        {
            HasPagination = true;
            HasDetailPage = true;
            ApiIssues = new List<string>();
            ApiIssuesLevel2 = new List<string>();
            MissingRequiredFields = new List<string>();
            InvalidUniqueFields = new List<string>();
            InvalidFormats = new List<string>();
            InvalidDataTypes = new List<string>();
            InvalidValues = new List<string>();
            ResourceCounts = new List<ResourceCount>();
        }

        public void PerformFinalReview()
        {
            if (!HasPagination)
            {
                ApiIssues.Add("A paginatable service method is not present. Of the form /services?page={nn}");
            }
            if (!HasDetailPage)
            {
                ApiIssues.Add("Missing search detail pages. It should be findable under /services/{id}");
            }
            if (!HasPaginationMetaData)
            {
                ApiIssues.Add("Missing search method paginaton metadata at the begining of the JSON payload it should be in the following format: {\"totalElements\":nn,\"totalPages\":nn,\"number\":nn,\"size\":nn,\"first\":bb,\"last\":bb");
            }
            Level1Pass = HasDetailPage && HasPagination && HasPaginationMetaData;
            Level2Pass = (Level1Pass && ApiIssuesLevel2.Count == 0 && Level2TestsRun > 0);
            ApiIssues.AddRange(ApiIssuesLevel2);
        }

        public void AddResourceCount(Resource resource)
        {
            ResourceCounts.Add(new Results.ResourceCount(resource.Name, resource.Count));
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

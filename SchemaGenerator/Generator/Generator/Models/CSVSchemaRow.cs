using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor.Models
{
    public class CSVSchemaRow : IComparable<CSVSchemaRow>
    {
        public string SchemaIdentifier = "CombinedServiceSchema";
        public string SchemaMajorVersion = "1";
        public string SchemaMajorVersionDate = DateTime.Now.ToShortDateString();
        public string SchemaLabel = "Combined Service Schema";
        public string SchemaDescription = "CSV definition of the structure of CSV schemas!";
        public string SchemaTemplateId = "Plain";
        public string SchemaMinorVersions = "0";
        public string SchemaMinorVersionDates = DateTime.Now.ToShortDateString();
        public string SchemaMinorVersionDescriptions = "First formal release";
        public string SchemaRequirementIdentifier = "Field";
        public string SchemaRequirementOrder = "1";
        public string SchemaRequirementLabel = "Field";
        public string SchemaRequirementMandatory = "TRUE";
        public string SchemaRequirementDescription = "Field, from pool of fields, used to meet the schema field requirements.  That is, as standard property which is re-used across schema requirements";
        public string SchemaRequirementMinOccurances = "1";
        public string SchemaRequirementMaxOccurances = "1";
        public string SchemaRequirementNote;
        public string SchemaRequirementFieldIdentifier;
        public string SchemaRequirementFieldOrder;
        public string SchemaRequirementFieldDescription;
        public string SchemaRequirementFieldMandatory;
        public string SchemaRequirementFieldMinOccurances;
        public string SchemaRequirementFieldMaxOccurances;
        public string SchemaRequirementFieldHelp;
        public string FieldIdentifier;
        public string FieldLabel;
        public string FieldType;
        public string FieldDescription;
        public string FieldPattern;
        public string FieldURIStubs;

        public int Sort;

        public int CompareTo(CSVSchemaRow other)
        {
            return Sort.CompareTo(other.Sort);
        }

        public override string ToString()
        {
            return string.Format("\"{0}\",\"{1}\",\"{2}\",\"{3}\",\"{4}\",\"{5}\",\"{6}\",\"{7}\",\"{8}\",\"{9}\",\"{10}\",\"{11}\",\"{12}\",\"{13}\",\"{14}\",\"{15}\",\"{16}\",\"{17}\",\"{18}\",\"{19}\",\"{20}\",\"{21}\",\"{22}\",\"{23}\",\"{24}\",\"{25}\",\"{26}\",\"{27}\",\"{28}\",\"{29}\"",
                SchemaIdentifier,
                SchemaMajorVersion,
                SchemaMajorVersionDate,
                SchemaLabel,
                SchemaDescription,
                SchemaTemplateId,
                SchemaMinorVersions,
                SchemaMinorVersionDates,
                SchemaMinorVersionDescriptions,
                SchemaRequirementIdentifier,
                SchemaRequirementOrder,
                SchemaRequirementLabel,
                SchemaRequirementMandatory,
                SchemaRequirementDescription,
                SchemaRequirementMinOccurances,
                SchemaRequirementMaxOccurances,
                SchemaRequirementNote,
                SchemaRequirementFieldIdentifier,
                SchemaRequirementFieldOrder,
                SchemaRequirementFieldDescription,
                SchemaRequirementFieldMandatory,
                SchemaRequirementFieldMinOccurances,
                SchemaRequirementFieldMaxOccurances,
                SchemaRequirementFieldHelp,
                FieldIdentifier,
                FieldLabel,
                FieldType, 
                FieldDescription,
                FieldPattern,
                FieldURIStubs);
        }
    }
}

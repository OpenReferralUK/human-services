using System;
using System.Data;

namespace ServiceDirectory.Common.Validation
{
    public class RegisteredOrganisation
    {
        public string OrganisationName { get; set; }
        public string OrganisationType { get; set; }
        public string AdoptationStage { get; set; }
        public string Url { get; set; }
        public string PrivateEmailAddress { get; set; }
        public string PublicEmailAddress { get; set; }
        public DateTime DateRegistered { get; set; }

        public static RegisteredOrganisation Build(IDataReader reader)
        {
            return new RegisteredOrganisation
            {
                OrganisationName = Convert.ToString(reader["organisation_name"]),
                OrganisationType = Convert.ToString(reader["organisation_type"]),
                AdoptationStage = Convert.ToString(reader["adoptation_stage"]),
                Url = Convert.ToString(reader["url"]),
                PrivateEmailAddress = Convert.ToString(reader["private_email_address"]),
                PublicEmailAddress = Convert.ToString(reader["public_email_address"]),
                DateRegistered = Convert.ToDateTime(reader["date_registered"])
            };
        }

    }
}

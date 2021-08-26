using Microsoft.Extensions.Configuration;

namespace ServiceDirectory.Common.Config
{
    public class Settings
    {
        ConfigSection section;

        public Settings(IConfiguration configuration)
        {
            section = new ConfigSection(configuration, "Settings");
        }

        public string DefaultSupportEmail
        {
            get { return section.GetOrDefault("DefaultSupportEmail", "support@esd.org.uk"); }
        }

        public string[] RegisterAlertEmail
        {
            get { return section.GetOrDefault("RegisterAlertEmail", new[] { DefaultSupportEmail }); }
        }

        public string RegisteredUsersUrl
        {
            get { return section.GetOrDefault("RegisteredUsersUrl", "https://validator.openreferraluk.org/api/RegisteredUsers"); }
        }

        public string RegisteredOrganisationsUrl
        {
            get { return section.GetOrDefault("RegisteredUsersUrl", "https://validator.openreferraluk.org/api/RegisteredOrganisations"); }
        }
    }
}

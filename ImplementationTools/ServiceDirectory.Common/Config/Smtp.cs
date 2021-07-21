using Microsoft.Extensions.Configuration;

namespace ServiceDirectory.Common.Config
{
    public class Smtp
    {
        ConfigSection section;

        public Smtp(IConfiguration configuration)
        {
            this.section = new ConfigSection(configuration, "Smtp");
        }

        public string Host
        {
            get
            {
                return section.GetOrDefault("Smtp.Host", "smtp.gmail.com");
            }
        }


        public int Port
        {
            get
            {
                return section.GetOrDefault("Smtp.Port", 25);
            }
        }


        public string Username
        {
            get
            {
                return section.GetOrDefault("Smtp.Username", "support@esd.org.uk");
            }
        }


        public string Password
        {
            get
            {
                return section.GetOrDefault("Smtp.Password", "SkMl20pk%");
            }
        }


        public bool EnableSsl
        {
            get
            {
                return section.GetOrDefault("Smtp.EnableSsl", true);
            }
        }
    }
}

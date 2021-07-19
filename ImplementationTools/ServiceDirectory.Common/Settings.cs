using System;
using System.Configuration;

namespace ServiceDirectory.Common
{
    public static class Settings
    {
        public static string GetOrDefault(string name, string defaultValue)
        {
            var s = ConfigurationManager.AppSettings[name];

            if (string.IsNullOrEmpty(s))
                return defaultValue;

            return s;
        }

        public static int GetOrDefault(string name, int defaultValue)
        {
            var s = ConfigurationManager.AppSettings[name];

            if (string.IsNullOrEmpty(s))
                return defaultValue;

            if (!int.TryParse(s, out int value))
                return defaultValue;

            return value;
        }

        public static bool GetOrDefault(string name, bool defaultValue)
        {
            var s = ConfigurationManager.AppSettings[name];

            if (string.IsNullOrEmpty(s))
                return defaultValue;

            return string.Equals(s, true.ToString(), StringComparison.InvariantCultureIgnoreCase);
        }

        public static string DefaultSupportEmail
        {
            get { return GetOrDefault("Settings.DefaultSupportEmail", "support@esd.org.uk"); }
        }

        public static string RegisterAlertEmail
        {
            get { return GetOrDefault("Settings.DefaultSupportEmail", DefaultSupportEmail); }
        }

        public static string RegisteredUsersUrl
        {
            get { return GetOrDefault("Settings.RegisteredUsersUrl", "https://validator.openreferraluk.org/api/RegisteredUsers"); }
        }

        public static string RegisteredOrganisationsUrl
        {
            get { return GetOrDefault("Settings.RegisteredUsersUrl", "https://validator.openreferraluk.org/api/RegisteredOrganisations"); }
        }

        public static class Smtp
        {
            public static string Host
            {
                get
                {
                    return GetOrDefault("Settings.Smtp.Host", "smtp.gmail.com");
                }
            }


            public static int Port
            {
                get
                {
                    return GetOrDefault("Settings.Smtp.Port", 25);
                }
            }


            public static string Username
            {
                get
                {
                    return GetOrDefault("Settings.Smtp.Username", "support@esd.org.uk");
                }
            }


            public static string Password
            {
                get
                {
                    return GetOrDefault("Settings.Smtp.Password", "SkMl20pk%");
                }
            }


            public static bool EnableSsl
            {
                get
                {
                    return GetOrDefault("Settings.Smtp.EnableSsl", true);
                }
            }
        }
    }
}

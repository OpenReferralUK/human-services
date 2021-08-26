using Microsoft.Extensions.Configuration;
using System;

namespace ServiceDirectory.Common.Config
{
    public class ConfigSection
    {
        private IConfiguration configuration;
        private string sectionName;

        public ConfigSection(IConfiguration configuration, string sectionName)
        {
            this.configuration = configuration;
            this.sectionName = sectionName;
        }

        public IConfigurationSection Section
        {
            get
            {
                return configuration.GetSection(sectionName);
            }
        }

        public TValue GetValue<TValue>(string name)
        {
            var section = configuration.GetSection(sectionName);
            if (section == null)
                return default(TValue);
            var prop = section.GetSection(name);
            if (prop == null)
                return default(TValue);
            return prop.Get<TValue>();
        }

        public string GetStringValue(string name)
        {
            return GetValue<string>(name);
        }

        public string GetOrDefault(string name, string defaultValue)
        {
            var s = GetStringValue(name);

            if (string.IsNullOrEmpty(s))
                return defaultValue;

            return s;
        }

        public string[] GetOrDefault(string name, string[] defaultValue)
        {
            var v = GetValue<string[]>(name);

            if (v == null)
                return defaultValue;

            return v;
        }

        public int GetOrDefault(string name, int defaultValue)
        {
            var s = GetStringValue(name);

            if (string.IsNullOrEmpty(s))
                return defaultValue;

            if (!int.TryParse(s, out int value))
                return defaultValue;

            return value;
        }

        public bool GetOrDefault(string name, bool defaultValue)
        {
            var s = GetStringValue(name);

            if (string.IsNullOrEmpty(s))
                return defaultValue;

            return string.Equals(s, true.ToString(), StringComparison.InvariantCultureIgnoreCase);
        }
    }
}

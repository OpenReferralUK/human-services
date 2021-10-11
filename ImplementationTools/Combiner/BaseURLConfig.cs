using System;
using System.Configuration;
using System.Linq;

namespace Combiner
{
    public class BaseURLElement : ConfigurationElement
    {
        [ConfigurationProperty("url", IsKey = true, IsRequired = true)]
        public string URL
        {
            get { return (string)this["url"]; }
        }

        [ConfigurationProperty("serverkey", IsKey = false, IsRequired = true)]
        public string ServerKey
        {
            get { return (string)this["serverkey"]; }
        }

        [ConfigurationProperty("id", IsKey = false, IsRequired = true)]
        public int ID
        {
            get { return Convert.ToInt32(this["id"]); }
        }
    }

    public class BaseURLElementCollection : ConfigurationElementCollection
    {
        protected override ConfigurationElement CreateNewElement()
        {
            return new BaseURLElement();
        }


        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((BaseURLElement)element).URL;
        }
    }

    public class MultipleBaseURLsSection : ConfigurationSection
    {
        [ConfigurationProperty("Values")]
        public BaseURLElementCollection Values
        {
            get { return (BaseURLElementCollection)this["Values"]; }
        }
    }
}

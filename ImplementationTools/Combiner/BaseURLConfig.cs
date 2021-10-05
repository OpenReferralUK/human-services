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

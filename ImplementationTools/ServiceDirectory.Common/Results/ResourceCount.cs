using ServiceDirectory.Common.Validation;
using System.Collections.Generic;

namespace ServiceDirectory.Common.Results
{
    public class ResourceCount
    {
        public string Name { get; private set; }
        public int Count 
        {
            get
            {
                return ids.Count;
            } 
        }
        private HashSet<string> ids = new HashSet<string>();

        public ResourceCount(Resource resource)
        {
            Name = resource.Name;
            foreach (string id in resource.IDs)
            {
                ids.Add(id);
            }
        }
    }
}

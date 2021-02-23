using System.Collections.Generic;

namespace ServiceDirectory.Common.Validation
{
    public class Resource
    {
        public List<Field> Fields { get; set; }

        public bool Exists { get; set; }

        public string Name { get; private set; }

        public int Count { get; set; }

        public Resource(string name)
        {
            Name = name;
            Fields = new List<Field>();
        }

        public void AddField(Field field)
        {
            Fields.Add(field);
        }
    }
}

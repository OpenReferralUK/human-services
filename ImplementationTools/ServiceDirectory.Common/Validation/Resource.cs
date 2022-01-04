using System.Collections.Generic;

namespace ServiceDirectory.Common.Validation
{
    public class Resource
    {
        public List<Field> Fields { get; set; }

        public bool Exists { get; set; }

        public string Name { get; private set; }

        public string[] IDs
        {
            get
            {
                if (Fields != null)
                {
                    foreach(Field field in Fields)
                    {
                        if (field.Name == "id")
                        {
                            if (field.Values.Count == 0)
                            {
                                return new string[0];
                            }
                            return field.Values.ToArray();
                        }
                    }
                }
                return new string[0];
            }
        }

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

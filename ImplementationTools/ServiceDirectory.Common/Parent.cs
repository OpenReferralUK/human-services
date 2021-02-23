using System;
using System.Collections.Generic;

namespace ServiceDirectory.Common
{
    public class Parent
    {
        public string Name
        {
            get;
            private set;
        }

        public string ID
        {
            get;
            private set;
        }

        public Parent GrandParent
        {
            get;
            private set;
        }

        public Parent(string name, dynamic obj, Parent parent)
        {
            if (obj["id"] != null)
            {
                this.ID = obj["id"];
            }
            this.Name = name;
            this.GrandParent = parent;
        }

        public void AddID(dynamic obj)
        {
            AddAllIds(obj, this);
        }

        private void AddAllIds(dynamic obj, Parent parent)
        {
            SaveID(obj, parent, parent.Name);
            if (parent.GrandParent != null)
            {
                AddAllIds(obj, parent.GrandParent);
            }
        }
        internal static void SaveID(dynamic obj, Parent parent, string tableName)
        {
            string id = tableName + "_id";
            if (!((IDictionary<String, Object>)obj).ContainsKey(id)) {
                ((IDictionary<String, Object>)obj).Add(id, parent.ID);
            }
        }
    }
}

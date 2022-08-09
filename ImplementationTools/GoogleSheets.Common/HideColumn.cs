using System;
using System.Collections.Generic;
using System.Text;

namespace GoogleSheets.Common
{
    public class HideColumn
    {
        public string Name { get; set; }
        public int Index { get; set; }

        public HideColumn(string name, int index)
        {
            this.Name = name;
            this.Index = index;
        }
    }
}

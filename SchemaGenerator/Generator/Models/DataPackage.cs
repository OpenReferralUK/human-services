using Convertor.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Generator.Models
{
    public class DataPackage
    {
        public DataPackage()
        {
            Tables = new List<Table>();
        }

        public string Title
        {
            get;
            set;
        }

        public string Description
        {
            get;
            set;
        }

        public List<Table> Tables
        {
            get;
            set;
        }
    }
}

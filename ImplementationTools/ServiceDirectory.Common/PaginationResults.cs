using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceDirectory.Common
{
    public class PaginationResults
    {
        public List<dynamic> Items
        {
            get;
            private set;
        }

        public int TotalPages
        {
            get;
            set;
        }

        public List<string> MissingDetailIDs
        {
            get;
            private set;
        }

        public PaginationResults()
        {
            MissingDetailIDs = new List<string>();
            Items = new List<dynamic>();
            TotalPages = 1;
        }
    }
}

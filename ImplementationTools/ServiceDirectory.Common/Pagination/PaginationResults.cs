using System.Collections.Concurrent;
using System.Collections.Generic;

namespace ServiceDirectory.Common.Pagination
{
    public class PaginationResults
    {
        public ConcurrentBag<dynamic> Items
        {
            get;
            private set;
        }

        public int TotalPages
        {
            get;
            set;
        }

        public ConcurrentBag<string> MissingDetailIDs
        {
            get;
            private set;
        }

        public string[] MissingPaginationMetaData { get; set; } = new string[0];
        
        public bool HasPaginationMetaData
        {
            get
            {
                return MissingPaginationMetaData == null || MissingPaginationMetaData.Length == 0;
            }
        }

        public bool HasInvalidTotalPages { get; set; }

        public PaginationResults()
        {
            MissingDetailIDs = new ConcurrentBag<string>();
            Items = new ConcurrentBag<dynamic>();
            HasInvalidTotalPages = false;
            TotalPages = 1;
        }
    }
}

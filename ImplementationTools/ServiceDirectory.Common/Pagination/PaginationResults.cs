using System.Collections.Generic;

namespace ServiceDirectory.Common.Pagination
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
            MissingDetailIDs = new List<string>();
            Items = new List<dynamic>();
            HasInvalidTotalPages = false;
            TotalPages = 1;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleSheets.Common
{
    public class ForeignKeyAssociaion
    {
        public int SheetId { get; private set; }
        public int StartColumnIndex { get; set; }
        public string SheetName { get; private set; }
        public string Field { get; private set; }
        public string ReferenceTable { get; private set; }
        public string ReferenceField { get; private set; }
        public bool Found { get; set; }

        public ForeignKeyAssociaion(int sheetId, string sheetName, string field, string referenceTable, string referenceField)
        {
            SheetId = sheetId;
            SheetName = sheetName;
            Field = field;
            ReferenceTable = referenceTable;
            ReferenceField = referenceField;
        }
    }
}

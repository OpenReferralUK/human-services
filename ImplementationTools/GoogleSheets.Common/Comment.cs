using System;
using System.Collections.Generic;
using System.Text;

namespace GoogleSheets.Common
{
    public class Comment
    {
        public int SheetID { get; set; }
        public int ColumnNo { get; set; }
        public string Text { get; set; }

        public Comment(int sheetID, int columnNo, string text)
        {
            this.SheetID = sheetID;
            this.ColumnNo = columnNo;
            this.Text = text;
        }
    }
}

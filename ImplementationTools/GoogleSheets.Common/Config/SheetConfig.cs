using System;
using System.Collections.Generic;
using System.Text;

namespace GoogleSheets.Common.Config
{
    public class SheetConfig
    {
        public List<CommentColumn> Comment { get; set; }
        public List<HideColumn> HideColumns { get; set; }
        public List<HideSheet> HideSheets { get; set; }
        public List<AddColumn> Columns { get; set; }

        private HashSet<string> hideColumns = null;
        private HashSet<string> hideSheets = null;
        private Dictionary<string, string> commentColumns = null;

        public bool IsColumnHidden(string sheet, string column)
        {
            if (hideColumns == null)
            {
                hideColumns = new HashSet<string>();
                foreach(HideColumn col in HideColumns)
                {
                    hideColumns.Add(col.Column);
                }
            }
            return hideColumns.Contains(sheet + "." + column);
        }

        public bool IsSheetHidden(string sheet)
        {
            if (hideSheets == null)
            {
                hideSheets = new HashSet<string>();
                foreach (HideSheet col in HideSheets)
                {
                    hideSheets.Add(col.Sheet);
                }
            }
            return hideSheets.Contains(sheet);
        }

        public string GetComment(string sheet, string column)
        {
            if (commentColumns == null)
            {
                commentColumns = new Dictionary<string, string>();
                foreach (CommentColumn col in Comment)
                {
                    commentColumns.Add(col.Column, col.Comment);
                }
            }

            string key = sheet + "." + column;
            if (!commentColumns.ContainsKey(key))
            {
                return string.Empty;
            }
            return commentColumns[key];
        }
    }
}

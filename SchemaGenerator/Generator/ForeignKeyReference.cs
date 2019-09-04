namespace Convertor
{
    public class ForeignKeyReference
    {
        public string TableName
        {
            get;
            private set;
        }

        public string ReferenceTableName
        {
            get;
            private set;
        }

        public string TableField
        {
            get;
            private set;
        }

        public string ReferenceTableField
        {
            get;
            private set;
        }

        public ForeignKeyReference(string tableName, string tableField, string referenceTableName, string referenceTableField)
        {
            this.TableName = tableName;
            this.TableField = tableField;
            this.ReferenceTableName = referenceTableName;
            this.ReferenceTableField = referenceTableField;
        }

        public string ToGV(bool hidden, string primaryKey)
        {
            string field = TableField;
            if (hidden)
            {
                field = primaryKey;
            }
            return string.Format("{0}:{1} -> {2}:{3};", TableName, field, ReferenceTableName, ReferenceTableField);
        }

        public string ToSQL(string primaryKey, int index)
        {
            return string.Format("CONSTRAINT FK_{0}_{1} FOREIGN KEY ({2}) REFERENCES {3}({4})", TableName, index, TableField, ReferenceTableName, ReferenceTableField);
        }
    }
}

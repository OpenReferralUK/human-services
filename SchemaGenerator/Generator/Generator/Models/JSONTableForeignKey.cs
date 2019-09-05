namespace Convertor.Models
{
    public class JSONTableForeignKey
    {
        public string fields;
        public JSONTableForeignKeyReference reference;

        public JSONTableForeignKey(ForeignKeyReference refer)
        {
            fields = refer.TableField;
            reference = new JSONTableForeignKeyReference();
            reference.fields = refer.ReferenceTableField;
            reference.resource = refer.ReferenceTableName;
        }
    }
}

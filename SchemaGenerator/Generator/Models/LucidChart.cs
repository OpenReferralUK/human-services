using Convertor;
using Convertor.Models;
using System.IO;
using System.Text;

namespace Generator.Models
{
    public class LucidChart
    {
        private DataPackage dataPackage;

        internal LucidChart(DataPackage dataPackage)
        {
            this.dataPackage = dataPackage;
        }

        internal void Generate(Options options)
        {
            StringBuilder sb = new StringBuilder();

            foreach (Table table in dataPackage.Tables)
            {
                sb.Append(table.ToERD(options));
            }

            File.WriteAllText(FileUtility.CreatePath(options, "lucidchart.csv", ".csv"), sb.ToString());
        }
    }
}

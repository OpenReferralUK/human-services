using ServiceDirectory.Common;
using ServiceDirectory.Common.Results;
using System;

namespace Validator
{
    class Program
    {
        static void Main(string[] args)
        {
            ValidationResult result = APIValidator.Validate("https://api.porism.com/ServiceDirectoryServiceOpenActiveAggregated/", string.Empty).GetAwaiter().GetResult();

            Console.WriteLine(result.ToString());
            Console.ReadKey();
        }
    }
}

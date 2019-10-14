using NLog;
using System;

namespace ServiceLoader
{
    class Program
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        static void Main(string[] args)
        {
            var reader = new ServiceReader();
            var pageCount = int.MaxValue;

            using (var writer = new ServiceWriter())
            {
                for (var pageNumber = 1; pageNumber <= pageCount; pageNumber++)
                {
                    Console.WriteLine($"Processing page {pageNumber}");
                    try
                    {
                        var page = reader.ReadPage(pageNumber);
                        writer.Write(page.Results);
                        pageCount = page.PageCount;
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                        Logger.Error(e);
                    }
                }
            }

            Console.WriteLine("Complete. Press any key to exit.");
            Console.ReadKey();
        }
    }
}

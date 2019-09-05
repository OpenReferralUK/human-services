using Convertor;
using System.IO;

namespace Generator
{
    internal class FileUtility
    {
        internal static string CreatePath(Options options, string defaultFileName, string extentsion)
        {
            string filename = string.Empty;
            if (string.IsNullOrEmpty(options.Title))
            {
                filename = defaultFileName;
            }
            else
            {
                filename += options.Title;
                filename += extentsion;
            }

            if (!string.IsNullOrEmpty(options.Output))
            {
                return Path.Combine(options.Output, filename);
            }

            return filename;
        }
    }
}

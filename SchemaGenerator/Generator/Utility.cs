using Generator.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor
{
    internal class Utility
    {
        internal static string GetSourceColour(string source, string defaultColour)
        {
            if (!string.IsNullOrEmpty(source))
            {
                if (source == "openReferral")
                {
                    return "lawngreen";
                }
                else if (source == "LGA")
                {
                    return "lightblue";
                }
                else if (source == "ical")
                {
                    return "orange";
                }
                else if (source == "openCommunity")
                {
                    return "palevioletred";
                }
            }

            return defaultColour;
        }

        internal static string LeftEscape(Options options)
        {
            if (options.Engine == 1)
            {
                return "`";
            }
            return "[";
        }

        internal static string RightEscape(Options options)
        {
            if (options.Engine == 1)
            {
                return "`";
            }
            return "]";
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor
{
    internal class Utility
    {
        internal static string GetSourceColour(dynamic source, string defaultColour)
        {
            if (source != null)
            {
                if (source == "openReferral")
                {
                    return "lawngreen";
                }
                else if (source == "lga")
                {
                    return "lightblue";
                }
                else if (source == "ical")
                {
                    return "orange";
                }
            }

            return defaultColour;
        }
    }
}

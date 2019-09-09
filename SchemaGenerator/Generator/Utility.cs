using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Convertor
{
    internal class Utility
    {
        internal static string GetSourceColour(dynamic applicationProfile, string defaultColour)
        {
            if (applicationProfile != null)
            {
                if (applicationProfile == "openReferral")
                {
                    return "lawngreen";
                }
                else if (applicationProfile == "LGA")
                {
                    return "lightblue";
                }
                else if (applicationProfile == "ical")
                {
                    return "orange";
                }
            }

            return defaultColour;
        }
    }
}

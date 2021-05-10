using System;
using System.Collections.Generic;

namespace ServiceDirectory.Common.DataStandard
{
    public class Resources
    {
        public static string FindResourceName(string name, List<string> resourceNames)
        {
            string lastMatch = string.Empty;
            foreach (string rName in resourceNames)
            {
                if (name.StartsWith(rName) && rName.Length > lastMatch.Length)
                {
                    lastMatch = rName;
                }
            }
            return lastMatch;
        }

        public static bool ShowItem(dynamic item)
        {
            if (item.name.Value.EndsWith("_ids"))
            {
                return false;
            }
            if (item.applicationProfile == null)
            {
                return true;
            }
            foreach (dynamic profile in item.applicationProfile)
            {
                if (profile.name == "LGA" || profile.name == "openReferral")
                {
                    return true;
                }
            }
            return false;
        }
    }
}

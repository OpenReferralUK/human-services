using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace ServiceLoader
{
    internal static class PriceParser
    {
        private static readonly IEnumerable<string> FreeWords = new List<string>
        {
            "free", "no cost"
        };

        /// <summary>
        /// Take the text up to the first whitespace. Translate this to decimal.
        /// </summary>
        /// <param name="description">Text description of amount</param>
        /// <returns>The amount if possible to parse, else null</returns>
        public static decimal? Parse(string description)
        {
            description = description?.Split()?.FirstOrDefault();
            if (description == null) return null;
            if (FreeWords.Contains(description, StringComparer.OrdinalIgnoreCase)) return 0m;
            return description.EndsWith("p", StringComparison.OrdinalIgnoreCase)
                ? ParsePence(description)
                : ParsePounds(description);
        }

        private static decimal? ParsePounds(string description)
        {
            return decimal.TryParse(description, NumberStyles.Currency, CultureInfo.GetCultureInfo("en-GB"), out var result) ? result : (decimal?)null;
        }

        private static decimal? ParsePence(string description)
        {
            if (description.EndsWith("p")) description = description.TrimEnd("p".ToCharArray());
            if (decimal.TryParse(description, NumberStyles.Currency, CultureInfo.GetCultureInfo("en-GB"), out var result)) return result;
            if (int.TryParse(description, out var pence)) return pence / 100m;
            return null;
        }
    }
}

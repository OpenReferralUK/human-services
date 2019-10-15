using System;
using System.Collections.Generic;
using System.Linq;
using ServiceLoader.JsonMappingObjects;

namespace ServiceLoader
{
    internal static class ScheduleBuilder
    {
        public static IEnumerable<Schedule> Build(Result result)
        {
            var validDays = new string[] { "SU", "MO", "TU", "WE", "TH", "FR", "SA" };
            foreach (var day in result.Days.Distinct())
            {
                if (day.Length < 2) continue;
                var dayAbbrv = day.Substring(0, 2).ToUpperInvariant();
                if (!validDays.Contains(dayAbbrv, StringComparer.Ordinal)) continue;

                yield return new Schedule($"{result.ServiceId}:{day}", dayAbbrv, result.Frequency);
            }
        }
    }
}

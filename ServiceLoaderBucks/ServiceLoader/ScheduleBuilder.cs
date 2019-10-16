using System;
using System.Collections.Generic;
using System.Linq;
using ServiceLoader.JsonMappingObjects;

namespace ServiceLoader
{
    internal static class ScheduleBuilder
    {
        /// <summary>
        /// Generates schedule information from Days and Frequency
        /// </summary>
        /// <param name="result">The record representing a service</param>
        /// <returns>Schedule information which is not guaranteed to be completely accurate</returns>
        public static IEnumerable<Schedule> Build(Result result)
        {
            var validDays = new string[] { "SU", "MO", "TU", "WE", "TH", "FR", "SA" };
            var text = result.Frequency?.ToLowerInvariant() ?? string.Empty;
            text = text.Replace("&", " and ")
                       .Replace(",", " and ")
                       .Replace("mondays", "MO")
                       .Replace("tuesdays", "TU")
                       .Replace("wednesdays", "WE")
                       .Replace("thursdays", "TH")
                       .Replace("fridays", "FR")
                       .Replace("saturdays", "SA")
                       .Replace("sundays", "SU")
                       .Replace("monday", "MO")
                       .Replace("tuesday", "TU")
                       .Replace("wednesday", "WE")
                       .Replace("thursday", "TH")
                       .Replace("friday", "FR")
                       .Replace("saturday", "SA")
                       .Replace("sunday", "SU")
                       .Replace("mon", "MO")
                       .Replace("tue", "TU")
                       .Replace("wed", "WE")
                       .Replace("thu", "TH")
                       .Replace("fri", "FR")
                       .Replace("sat", "SA")
                       .Replace("sun", "SU")
                       .Replace(" - ", "-")
                       .Replace(" midday ", "12:00")
                       .Replace(" noon ", "12:00")
                       .Replace(" midnight ", "00:00");

            var parts = text.Split(new[] {"and", " "}, StringSplitOptions.RemoveEmptyEntries).Select(part => part.Trim());
            var weeklyMonthlyWords = new string[]{"alternate", "1st", "2nd", "3rd", "4th", "first", "second", "third", "fourth", "last"};
            var weeklyMonthly = parts.Intersect(weeklyMonthlyWords, StringComparer.OrdinalIgnoreCase).Any() ? "MONTHLY" : "WEEKLY";
            var days = result.Days.Distinct().ToList();
            var times = new List<Times>();

            foreach (var part in parts)
            {
                if (validDays.Contains(part, StringComparer.OrdinalIgnoreCase))
                {
                    if (!days.Contains(part, StringComparer.OrdinalIgnoreCase)) days.Add(part);
                    continue;
                }

                if (char.IsDigit(part, 0))
                {
                    var timeParts = part.Split('-').Select(timePart => timePart.Trim()).ToArray();
                    if (timeParts.Length > 2) continue;
                    if (!TimeSpan.TryParse(timeParts[0], out var startTime)) continue;
                    var time = new Times{StartTime = startTime};
                    if (timeParts.Length > 1 && TimeSpan.TryParse(timeParts[1], out var endTime)) time.EndTime = endTime;
                    times.Add(time);
                }
            }

            if (times.Count > 1) times.Clear(); //better to write no information than partial information - we are targetting the simple records
            
            foreach (var day in days)
            {
                if (day.Length < 2) continue;
                var dayAbbrv = day.Substring(0, 2).ToUpperInvariant();
                if (!validDays.Contains(dayAbbrv, StringComparer.Ordinal)) continue;

                yield return new Schedule($"{result.ServiceId}:{day}", dayAbbrv, result.Frequency, weeklyMonthly, times.FirstOrDefault()?.StartTime, times.FirstOrDefault()?.EndTime);
            }

            if (!days.Any()) yield return new Schedule($"{result.ServiceId}:unknown", string.Empty, result.Frequency, weeklyMonthly, times.FirstOrDefault()?.StartTime, times.FirstOrDefault()?.EndTime);
        }

        private class Times
        {
            public TimeSpan StartTime { get; set; }
            public TimeSpan? EndTime { get; set; }
        }
    }
}

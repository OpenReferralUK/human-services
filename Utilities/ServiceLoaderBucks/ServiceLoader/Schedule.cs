using System;

namespace ServiceLoader
{
    public class Schedule
    {
        public Schedule(string day, string description, string weeklyMonthly, TimeSpan? opensAt, TimeSpan? closesAt, string interval)
        {
            Id = Guid.NewGuid().ToString();
            Day = day;
            Description = description;
            WeeklyMonthly = weeklyMonthly;
            OpensAt = opensAt;
            ClosesAt = closesAt;
            Interval = interval;
        }

        public string Id { get; }
        public string Day { get; }
        public string Description { get; }
        public string WeeklyMonthly { get; }
        public TimeSpan? OpensAt { get; }
        public TimeSpan? ClosesAt { get; }
        public string Interval { get; }
    }
}

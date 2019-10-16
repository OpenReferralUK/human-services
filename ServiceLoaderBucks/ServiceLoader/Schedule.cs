using System;

namespace ServiceLoader
{
    public class Schedule
    {
        public Schedule(string id, string day, string description, string weeklyMonthly, TimeSpan? opensAt, TimeSpan? closesAt)
        {
            Id = id;
            Day = day;
            Description = description;
            WeeklyMonthly = weeklyMonthly;
            OpensAt = opensAt;
            ClosesAt = closesAt;
        }

        public string Id { get; }
        public string Day { get; }
        public string Description { get; }
        public string WeeklyMonthly { get; }
        public TimeSpan? OpensAt { get; }
        public TimeSpan? ClosesAt { get; }
    }
}

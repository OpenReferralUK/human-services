namespace ServiceLoader
{
    public class Schedule
    {
        public Schedule(string id, string day, string description)
        {
            Id = id;
            Day = day;
            Description = description;
        }

        public string Id { get; }
        public string Day { get; }
        public string Description { get; }
    }
}

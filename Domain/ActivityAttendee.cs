using System;

namespace Domain
{
    public class ActivityAttendance
    {
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public Guid ActivityId { get; set; }
        public Activity Activity { get; set; }
        public bool IsHost { get; set; }
    }
}
using System;
using System.Text.Json.Serialization;

namespace Application.UserProfiles
{
    public class UserActivityDto
    {
        public Guid ActivityId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        [JsonIgnore]
        public string hostUserName { get; set; }
    }
}
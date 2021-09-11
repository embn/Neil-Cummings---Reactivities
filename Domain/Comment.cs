using System;

namespace Domain
{
    public class Comment
    {
         public int Id { get; set; }
         public string Body { get; set; }
         public AppUser Author { get; set; }
         public Guid? ActivityId { get; set; }//Nullable just in case user is deleted
         public Activity Activity { get; set; }
         public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
using System;

namespace Application.Comments
{
    public class CommentDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Body { get; set; }
        public string AuthorName { get; set; }
        public string AuthorDisplayName { get; set; }
        public string Image { get; set; }
    }
}
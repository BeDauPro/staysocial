using System;
namespace staysocial_be.Models
{
    public class Comment
    {
        public int CommentId { get; set; }

        public string UserId { get; set; }
        public AppUser User { get; set; }

        public int ApartmentId { get; set; }
        public Apartment Apartment { get; set; }

        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}


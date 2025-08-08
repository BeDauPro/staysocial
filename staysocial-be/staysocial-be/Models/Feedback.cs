using System;
namespace staysocial_be.Models
{
    public class Feedback
    {
        public int FeedbackId { get; set; }

        public string UserId { get; set; }
        public AppUser User { get; set; }

        public int ApartmentId { get; set; }
        public Apartment Apartment { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public int Rating { get; set; } 
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}


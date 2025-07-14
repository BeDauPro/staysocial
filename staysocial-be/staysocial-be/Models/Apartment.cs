using System;
using static System.Collections.Specialized.BitVector32;
using System.Threading;
using staysocial_be.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.Models
{
    public class Apartment
    {
        [Key]
        public int ApartmentId { get; set; }
        public int OwnerId { get; set; }
        public User Owner { get; set; }

        public string Name { get; set; }
        public string Address { get; set; }
        public decimal Price { get; set; }
        public float Area { get; set; }
        public string Amenities { get; set; }

        public AvailabilityStatus AvailabilityStatus { get; set; }
        public ApartmentStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ApartmentImage> Images { get; set; }
        public ICollection<Reaction> Reactions { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
    }

}


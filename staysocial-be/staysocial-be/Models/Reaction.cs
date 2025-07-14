using System;
using staysocial_be.Models.Enums;

namespace staysocial_be.Models
{
    public class Reaction
    {
        public int ReactionId { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int ApartmentId { get; set; }
        public Apartment Apartment { get; set; }

        public ReactionType Type { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}


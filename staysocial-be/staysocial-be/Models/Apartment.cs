using System;
using static System.Collections.Specialized.BitVector32;
using System.Threading;
using staysocial_be.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace staysocial_be.Models
{
    public class Apartment
    {
        [Key]
        public int ApartmentId { get; set; }
        public string OwnerId { get; set; }
        [ForeignKey("OwnerId")]
        public AppUser Owner { get; set; }

        public string Name { get; set; }
        public string Address { get; set; }
        public decimal Price { get; set; }
        public float Area { get; set; }
        public string Amenities { get; set; }

        public AvailabilityStatus AvailabilityStatus { get; set; }
        public ApartmentStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}


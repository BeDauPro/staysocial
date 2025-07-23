using System;
using staysocial_be.Models.Enums;

namespace staysocial_be.DTOs.Apartment
{
    public class ApartmentDto
    {
        public int ApartmentId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public decimal Price { get; set; }
        public string Amenities { get; set; }
        public string OwnerId { get; set; }
        public string OwnerEmail { get; set; }
        public AvailabilityStatus AvailabilityStatus { get; set; }
        public ApartmentStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}


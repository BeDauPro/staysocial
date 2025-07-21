using System;
using staysocial_be.Models.Enums;

namespace staysocial_be.DTOs.Apartment
{
    public class UpdateApartmentDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public decimal Price { get; set; }
        public string Amenities { get; set; }
        public AvailabilityStatus AvailabilityStatus { get; set; }
        public ApartmentStatus Status { get; set; }
    }
}


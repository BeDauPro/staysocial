using System;
namespace staysocial_be.DTOs.Apartment
{
    public class CreateApartmentDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public decimal Price { get; set; }
        public string Amenities { get; set; }
    }
}


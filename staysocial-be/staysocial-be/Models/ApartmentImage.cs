using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.Models
{
    public class ApartmentImage
    {
        public int ImageId { get; set; }
        [Key]
        public int ApartmentId { get; set; }
        public Apartment Apartment { get; set; }

        public string ImageUrl { get; set; }
    }
}


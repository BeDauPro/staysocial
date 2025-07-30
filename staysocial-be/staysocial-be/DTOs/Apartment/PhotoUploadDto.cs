using System;
namespace staysocial_be.DTOs.Apartment
{
    public class PhotoUploadDto
    {
        public IFormFile File { get; set; }
        public int? ApartmentId { get; set; }
    }
}


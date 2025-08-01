using System;
namespace staysocial_be.DTOs.Photo
{
	public class PhotoDto
	{
        public int Id { get; set; }
        public string Url { get; set; }
        public DateTime UploadedAt { get; set; }
        public int ApartmentId { get; set; }
    }
}


using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.DTOs.Photo
{
	public class PhotoUploadDto
	{
        [Required(ErrorMessage = "File ảnh là bắt buộc")]
        public IFormFile File { get; set; }

        [Required(ErrorMessage = "ID căn hộ là bắt buộc")]
        public int ApartmentId { get; set; }
    }
}


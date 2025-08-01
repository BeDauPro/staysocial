using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.DTOs.Photo
{
	public class MultiplePhotoUploadDto
	{
        [Required(ErrorMessage = "Danh sách file ảnh là bắt buộc")]
        public IEnumerable<IFormFile> Files { get; set; }

        [Required(ErrorMessage = "ID căn hộ là bắt buộc")]
        public int ApartmentId { get; set; }
    }
}


using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.DTOs.Photo
{
	public class SetMainPhotoDto
	{
        [Required(ErrorMessage = "ID ảnh là bắt buộc")]
        public int PhotoId { get; set; }
    }
}


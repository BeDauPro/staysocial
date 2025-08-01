using System;
namespace staysocial_be.DTOs.Photo
{
	public class PhotoUploadResponseDto
	{
        public bool Success { get; set; }
        public string Message { get; set; }
        public PhotoDto Photo { get; set; }
        public IEnumerable<string> Errors { get; set; }
    }
}


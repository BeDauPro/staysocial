using System;
namespace staysocial_be.DTOs.Photo
{
	public class MultiplePhotoUploadResponseDto
	{
        public bool Success { get; set; }
        public string Message { get; set; }
        public IEnumerable<PhotoDto> Photos { get; set; }
        public int SuccessCount { get; set; }
        public int FailedCount { get; set; }
        public IEnumerable<string> Errors { get; set; }

    }
}


using System;
namespace staysocial_be.DTOs.Comment
{
	public class CommentResponseDto
	{
        public int CommentId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public int ApartmentId { get; set; }
        public string ApartmentName { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}


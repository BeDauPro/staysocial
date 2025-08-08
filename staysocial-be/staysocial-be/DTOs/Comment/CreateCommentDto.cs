using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.DTOs.Comment
{
	public class CreateCommentDto
	{
        [Required]
        public int ApartmentId { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "Content cannot exceed 500 characters")]
        public string Content { get; set; }
    }
}


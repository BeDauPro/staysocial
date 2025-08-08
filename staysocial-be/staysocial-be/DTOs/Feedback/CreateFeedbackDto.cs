using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.DTOs.Feedback
{
	public class CreateFeedbackDto
	{
        [Required]
        public int ApartmentId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [Required]
        [StringLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
        public string Comment { get; set; }
    }
}


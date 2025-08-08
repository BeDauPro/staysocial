using System;
namespace staysocial_be.DTOs.Feedback
{
    public class FeedbackResponseDto
    {
        public int FeedbackId { get; set; }
        public string UserId { get; set; }
        public string FullName { get; set; }
        public int ApartmentId { get; set; }
        public string ApartmentName { get; set; }
        public int OrderId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}


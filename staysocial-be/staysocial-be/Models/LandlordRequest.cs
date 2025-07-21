using System;
namespace staysocial_be.Models
{
    public class LandlordRequest
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public string? Note { get; set; }
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public bool IsApproved { get; set; } = false;
        public DateTime? ApprovedAt { get; set; }
    }
}


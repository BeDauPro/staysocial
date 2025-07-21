using System;
namespace staysocial_be.Models
{
    public class Booking
    {
        public int BookingId { get; set; }

        public int UserId { get; set; }
        public AppUser User { get; set; }

        public int ApartmentId { get; set; }
        public Apartment Apartment { get; set; }

        public DateTime BookingDate { get; set; }
        public DateTime ScheduledTimeStart { get; set; }
        public DateTime ScheduledTimeEnd { get; set; }

        public bool IsDepositPaid { get; set; }
        public string Status { get; set; }
        public decimal DepositAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}


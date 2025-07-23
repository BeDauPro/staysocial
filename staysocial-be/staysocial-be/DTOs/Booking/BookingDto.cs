using System;
namespace staysocial_be.DTOs.Booking
{
    public class BookingDto
    {
        public int BookingId { get; set; }
        public string UserId { get; set; }
        public int ApartmentId { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime ScheduledTimeStart { get; set; }
        public DateTime ScheduledTimeEnd { get; set; }
        public bool IsDepositPaid { get; set; }
        public string Status { get; set; }
        public decimal DepositAmount { get; set; }
    }
}


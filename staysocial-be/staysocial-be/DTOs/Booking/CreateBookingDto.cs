using System;
namespace staysocial_be.DTOs.Booking
{
    public class CreateBookingDto
    {
        public int ApartmentId { get; set; }

        public DateTime BookingDate { get; set; } 

        public string TimeSlot { get; set; } 

        public decimal DepositAmount { get; set; }

        public string UserId { get; set; } 
    }
}


using System;

namespace staysocial_be.DTOs.Booking
{
    public class CreateBookingDto
    {
        public int ApartmentId { get; set; }
        public DateTime RentalStartDate { get; set; }    
        public DateTime RentalEndDate { get; set; }          
    }
}

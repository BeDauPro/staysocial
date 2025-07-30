using System;
using staysocial_be.Models.Enums;

namespace staysocial_be.DTOs.Booking
{
    public class BookingDto
    {
        public int BookingId { get; set; }
        public int ApartmentId { get; set; }

        public DateTime RentalStartDate { get; set; }      
        public DateTime RentalEndDate { get; set; }        
        public int TotalMonths { get; set; }                

        public decimal DepositAmount { get; set; }          
        public decimal MonthlyRent { get; set; }            
        public decimal TotalRentAmount { get; set; }        

        public BookingStatus Status { get; set; }         
        public DateTime CreatedAt { get; set; }
    }
}

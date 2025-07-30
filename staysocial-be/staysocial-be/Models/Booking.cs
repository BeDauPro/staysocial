using System;
using staysocial_be.Models.Enums;

namespace staysocial_be.Models
{
    public class Booking
    {
        public int BookingId { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int ApartmentId { get; set; }
        public Apartment Apartment { get; set; }
        // Thời gian thuê (khách tự chọn)
        public DateTime RentalStartDate { get; set; }       // VD: 1/8/2024
        public DateTime RentalEndDate { get; set; }         // VD: 31/12/2024
        public int TotalMonths { get; set; }                // VD: 5 tháng (8,9,10,11,12)

        // Tiền bạc
        public decimal DepositAmount { get; set; }          // Tiền cọc (1-2 tháng)
        public decimal MonthlyRent { get; set; }            // Tiền thuê/tháng
        public decimal TotalRentAmount { get; set; }        

        // Trạng thái
        public BookingStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}


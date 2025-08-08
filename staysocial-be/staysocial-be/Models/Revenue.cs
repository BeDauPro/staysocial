using System;
namespace staysocial_be.Models
{
    public class Revenue
    {
        public int RevenueId { get; set; }
        public decimal Amount { get; set; }
        public DateTime RecognizedAt { get; set; } // ngày ghi nhận doanh thu
        public string Source { get; set; } // e.g. "MonthlyRent", "Deposit"
        public int? OrderId { get; set; }
        public Order Order { get; set; }
        public int? BookingId { get; set; }
    }

}


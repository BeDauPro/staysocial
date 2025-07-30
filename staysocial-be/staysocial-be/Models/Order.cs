using System;
using MailKit.Search;
using staysocial_be.Models.Enums;

namespace staysocial_be.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public int BookingId { get; set; }

        public decimal Amount { get; set; }
        public OrderType OrderType { get; set; }
        public DateTime PaymentDate { get; set; }
        public OrderStatus Status { get; set; }

        // Thông tin tháng (cho MonthlyRent)
        public int? ForYear { get; set; }                   // VD: 2024
        public int? ForMonth { get; set; }                  // VD: 8 (tháng 8)

        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}


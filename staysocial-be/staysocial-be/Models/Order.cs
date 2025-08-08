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

        public int? ForYear { get; set; }                  
        public int? ForMonth { get; set; }                  

        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}


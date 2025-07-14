using System;
using staysocial_be.Models.Enums;

namespace staysocial_be.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }

        public int? BookingId { get; set; }
        public Booking Booking { get; set; }

        public int? OrderId { get; set; }
        public Order Order { get; set; }

        public decimal Amount { get; set; }
        public string Method { get; set; }

        public PaymentStatus Status { get; set; }
        public DateTime PaidAt { get; set; }
    }

}


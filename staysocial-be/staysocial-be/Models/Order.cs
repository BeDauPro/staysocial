using System;
using staysocial_be.Models.Enums;

namespace staysocial_be.Models
{
    public class Order
    {
        public int OrderId { get; set; }

        public int UserId { get; set; }
        public AppUser User { get; set; }

        public int ApartmentId { get; set; }
        public Apartment Apartment { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}


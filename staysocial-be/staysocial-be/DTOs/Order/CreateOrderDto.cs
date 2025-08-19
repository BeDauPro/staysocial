using System;
using staysocial_be.Models.Enums;

namespace staysocial_be.DTOs.Order
{
    public class CreateOrderDto
    {
        public int ApartmentId { get; set; }
        public decimal Amount { get; set; }              
        public OrderType OrderType { get; set; }        
        public string Description { get; set; }          
        public string ApartmentName { get; set; }        
        public int? ForYear { get; set; }
        public int? ForMonth { get; set; }
    }
}


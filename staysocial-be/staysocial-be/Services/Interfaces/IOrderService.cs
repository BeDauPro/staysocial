using System;
using staysocial_be.DTOs.Order;

namespace staysocial_be.Services.Interfaces
{
    public interface IOrderService
    {
        Task<string> CreateOrderAsync(CreateOrderDto dto, string returnUrl);
        Task<bool> ConfirmPaymentAsync(int orderId, bool success, IDictionary<string, string> vnpData = null);
    }

}


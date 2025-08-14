using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using staysocial_be.DTOs.Order;

namespace staysocial_be.Services.Interfaces
{
    public interface IOrderService
    {
  
        Task<string> CreateOrderAsync(CreateOrderDto dto, string returnUrl, string ipAddress);
        Task<bool> ConfirmPaymentAsync(int orderId, bool success, IDictionary<string, string> vnpData = null);
    }
}

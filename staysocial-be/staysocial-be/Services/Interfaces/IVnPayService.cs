using System;
using System.Collections.Generic;

namespace staysocial_be.Services.Interfaces
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(int orderId, decimal amount, string description, string returnUrl, string ipAddress = "127.0.0.1");
        bool ValidateResponse(IDictionary<string, string> queryParams);
    }
}

using System;
namespace staysocial_be.Services.Interfaces
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(int orderId, decimal amount, string description, string returnUrl);
        bool ValidateResponse(IQueryCollection query);
    }
}


using System;
using staysocial_be.Models;

namespace staysocial_be.Services.Interfaces
{
    public interface IRevenueService
    {
        Task AddRevenueAsync(Revenue revenue);
    }
}


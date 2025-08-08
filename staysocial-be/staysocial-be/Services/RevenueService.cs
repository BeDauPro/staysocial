using System;
using staysocial_be.Data;
using staysocial_be.Models;
using staysocial_be.Services.Interfaces;

namespace staysocial_be.Services
{
    public class RevenueService : IRevenueService
    {
        private readonly AppDbContext _db;
        public RevenueService(AppDbContext db) { _db = db; }

        public async Task AddRevenueAsync(Revenue revenue)
        {
            revenue.RecognizedAt = revenue.RecognizedAt == default ? DateTime.UtcNow : revenue.RecognizedAt;
            _db.Revenues.Add(revenue);
            await _db.SaveChangesAsync();
        }
    }
}


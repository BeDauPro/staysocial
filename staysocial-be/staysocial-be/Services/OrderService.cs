using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs.Order;
using staysocial_be.Models;
using staysocial_be.Models.Enums;
using staysocial_be.Services.Interfaces;

namespace staysocial_be.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _db;
        private readonly IVnPayService _vnPay;
        private readonly IRevenueService _revenueService;

        public OrderService(AppDbContext db, IVnPayService vnPay, IRevenueService revenueService)
        {
            _db = db;
            _vnPay = vnPay;
            _revenueService = revenueService;
        }

        public async Task<string> CreateOrderAsync(CreateOrderDto dto, string returnUrl, string ipAddress)
        {
            if (dto == null) throw new ArgumentException("Invalid request body");
            if (dto.Amount <= 0) throw new ArgumentException("Amount must be greater than 0");

            // ...existing code...
            var order = new Order
            {
                ApartmentId = dto.ApartmentId, 
                Amount = dto.Amount,
                OrderType = dto.OrderType,
                ForYear = dto.ForYear,
                ForMonth = dto.ForMonth,
                Description = string.IsNullOrWhiteSpace(dto.Description)
                    ? $"Thanh toán trực tiếp cho căn hộ {dto.ApartmentName}"
                    : dto.Description,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            // ...existing code...
            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // Tạo link VNPay cho orderId vừa tạo
            return _vnPay.CreatePaymentUrl(order.OrderId, order.Amount, order.Description, returnUrl, ipAddress);
        }

        public async Task<bool> ConfirmPaymentAsync(int orderId, bool success, IDictionary<string, string> vnpData = null)
        {
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null) return false;

            if (!success)
            {
                order.Status = OrderStatus.Failed;
                await _db.SaveChangesAsync();
                return false;
            }

            if (order.Status == OrderStatus.Paid) return true;

            order.Status = OrderStatus.Paid;
            order.PaymentDate = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            // Ghi nhận doanh thu
            await _revenueService.AddRevenueAsync(new Revenue
            {
                Amount = order.Amount,
                RecognizedAt = DateTime.UtcNow,
                Source = order.OrderType == OrderType.MonthlyRent ? "MonthlyRent" : "Deposit",
                OrderId = order.OrderId
            });

            return true;
        }
    }
}

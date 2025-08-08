using System;
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

        public async Task<string> CreateOrderAsync(CreateOrderDto dto, string returnUrl)
        {
            var booking = await _db.Bookings.FindAsync(dto.BookingId);
            if (booking == null) throw new Exception("Booking not found");

            var order = new Order
            {
                BookingId = dto.BookingId,
                Amount = dto.Amount,
                OrderType = dto.OrderType,
                ForYear = dto.ForYear,
                ForMonth = dto.ForMonth,
                Description = dto.Description,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // tạo paymentUrl
            var paymentUrl = _vnPay.CreatePaymentUrl(order.OrderId, order.Amount, order.Description ?? $"Order #{order.OrderId}", returnUrl);
            return paymentUrl;
        }

        public async Task<bool> ConfirmPaymentAsync(int orderId, bool success, IDictionary<string, string> vnpData = null)
        {
            var order = await _db.Orders
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null) return false;

            if (!success)
            {
                order.Status = OrderStatus.Failed;
                await _db.SaveChangesAsync();
                return false;
            }

            order.Status = OrderStatus.Paid;
            order.PaymentDate = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            // Nếu là thanh toán tiền thuê tháng => cộng doanh thu ngay
            if (order.OrderType == OrderType.MonthlyRent)
            {
                await _revenueService.AddRevenueAsync(new Revenue
                {
                    Amount = order.Amount,
                    RecognizedAt = DateTime.UtcNow,
                    Source = "MonthlyRent",
                    OrderId = order.OrderId,
                    BookingId = order.BookingId
                });
            }
            else if (order.OrderType == OrderType.Deposit)
            {
                // Đối với Deposit: không cộng doanh thu ngay.
                // Chúng ta chỉ lưu trạng thái Order Paid, và deposit sẽ được công nhận khi đến tháng bắt đầu thuê
                // (DepositRecognitionService sẽ xử lý).
            }

            return true;
        }
    }

}


using System;
using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs.DashboardStatisticsDto;
using staysocial_be.Models.Enums;
using staysocial_be.Services.Interfaces;

namespace staysocial_be.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly AppDbContext _context;

        public StatisticsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatisticsDto> GetDashboardStatisticsAsync(int year)
        {
            var now = DateTime.UtcNow;
            var thisMonth = now.Month;
            var lastMonth = now.AddMonths(-1).Month;

            // 1. Doanh thu hiện tại (tháng này)
            var thisMonthRevenue = await _context.Payments
                .Where(p => p.Status == PaymentStatus.Success && p.PaidAt.Year == year && p.PaidAt.Month == thisMonth)
                .SumAsync(p => p.Amount);

            var lastMonthRevenue = await _context.Payments
                .Where(p => p.Status == PaymentStatus.Success && p.PaidAt.Year == (lastMonth == 12 ? year - 1 : year) && p.PaidAt.Month == lastMonth)
                .SumAsync(p => p.Amount);

            var revenueGrowth = lastMonthRevenue > 0
                ? Math.Round((double)((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100, 1)
                : 100.0;

            // 2. Tỷ lệ lấp đầy = số booking đang dùng / tổng căn hộ
            var totalApartments = await _context.Apartments.CountAsync();

            var activeBookings = await _context.Bookings
                .Where(b => b.Status == "Confirmed" && b.ScheduledTimeStart <= now && b.ScheduledTimeEnd >= now)
                .CountAsync();

            var occupancyRate = totalApartments > 0
                ? Math.Round((double)activeBookings / totalApartments * 100, 1)
                : 0;

            // Giả định: tăng trưởng tỷ lệ lấp đầy = so với tháng trước
            var lastMonthActiveBookings = await _context.Bookings
                .Where(b => b.Status == "Confirmed" &&
                            b.ScheduledTimeStart <= now.AddMonths(-1) &&
                            b.ScheduledTimeEnd >= now.AddMonths(-1))
                .CountAsync();

            var occupancyGrowth = lastMonthActiveBookings > 0
                ? Math.Round((double)(activeBookings - lastMonthActiveBookings) / lastMonthActiveBookings * 100, 1)
                : 100.0;

            // 3. Tổng căn hộ
            // -> đã lấy ở trên

            // 4. Khách hàng mới (tạo trong tháng này)
            var thisMonthCustomers = await _context.Users
                .Where(u => u.CreatedAt.Year == year && u.CreatedAt.Month == thisMonth)
                .CountAsync();

            var lastMonthCustomers = await _context.Users
                .Where(u => u.CreatedAt.Year == (lastMonth == 12 ? year - 1 : year) && u.CreatedAt.Month == lastMonth)
                .CountAsync();

            var customerGrowth = lastMonthCustomers > 0
                ? Math.Round((double)(thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers * 100, 1)
                : 100.0;

            // 5. Doanh thu theo tháng
            var monthlyRevenue = await _context.Payments
                .Where(p => p.Status == PaymentStatus.Success && p.PaidAt.Year == year)
                .GroupBy(p => p.PaidAt.Month)
                .Select(g => new MonthlyRevenueDto
                {
                    Month = g.Key,
                    Revenue = g.Sum(p => p.Amount)
                })
                .ToListAsync();

            var fullMonthlyRevenue = Enumerable.Range(1, 12)
                .Select(m => new MonthlyRevenueDto
                {
                    Month = m,
                    Revenue = monthlyRevenue.FirstOrDefault(r => r.Month == m)?.Revenue ?? 0
                })
                .ToList();

            // 6. Biểu đồ tỷ lệ lấp đầy theo căn hộ
            var occupancyPerApartment = await _context.Apartments
                .Select(a => new OccupancyRateDto
                {
                    ApartmentName = a.Name,
                    Rate = _context.Bookings.Any(b => b.ApartmentId == a.ApartmentId &&
                                                      b.Status == "Confirmed" &&
                                                      b.ScheduledTimeStart <= now &&
                                                      b.ScheduledTimeEnd >= now)
                            ? 100
                            : 0
                })
                .ToListAsync();

            return new DashboardStatisticsDto
            {
                CurrentRevenue = thisMonthRevenue,
                RevenueGrowthPercent = revenueGrowth,
                OccupancyRate = occupancyRate,
                OccupancyGrowthPercent = occupancyGrowth,
                TotalApartments = totalApartments,
                NewCustomers = thisMonthCustomers,
                CustomerGrowthPercent = customerGrowth,
                MonthlyRevenueChart = fullMonthlyRevenue,
                OccupancyRateChart = occupancyPerApartment
            };
        }
    }

}


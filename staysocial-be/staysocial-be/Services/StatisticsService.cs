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
            var lastMonthYear = now.AddMonths(-1).Year;

            // 1. Doanh thu tháng này
            var thisMonthRevenue = await _context.Orders
                .Where(o => o.Status == OrderStatus.Paid
                            && o.PaymentDate.Year == year
                            && o.PaymentDate.Month == thisMonth
                            && o.OrderType == OrderType.MonthlyRent) 
                .SumAsync(o => o.Amount);

            // 2. Doanh thu tháng trước
            var lastMonthRevenue = await _context.Orders
                .Where(o => o.Status == OrderStatus.Paid
                            && o.PaymentDate.Year == lastMonthYear
                            && o.PaymentDate.Month == lastMonth
                            && o.OrderType == OrderType.MonthlyRent)
                .SumAsync(o => o.Amount);

            var revenueGrowth = lastMonthRevenue > 0
                ? Math.Round((double)((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100, 1)
                : 100.0;

            // 3. Tổng số căn hộ
            var totalApartments = await _context.Apartments.CountAsync();

            // 4. Booking đang active
            var activeBookings = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Active
                            && b.RentalStartDate <= now
                            && b.RentalEndDate >= now)
                .CountAsync();

            var occupancyRate = totalApartments > 0
                ? Math.Round((double)activeBookings / totalApartments * 100, 1)
                : 0;

            // 5. So sánh tỷ lệ lấp đầy tháng trước
            var lastMonthDate = now.AddMonths(-1);
            var lastMonthActiveBookings = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Active
                            && b.RentalStartDate <= lastMonthDate
                            && b.RentalEndDate >= lastMonthDate)
                .CountAsync();

            var occupancyGrowth = lastMonthActiveBookings > 0
                ? Math.Round((double)(activeBookings - lastMonthActiveBookings) / lastMonthActiveBookings * 100, 1)
                : 100.0;

            // 6. Khách hàng mới trong tháng này
            var thisMonthCustomers = await _context.Users
                .Where(u => u.CreatedAt.Year == year && u.CreatedAt.Month == thisMonth)
                .CountAsync();

            var lastMonthCustomers = await _context.Users
                .Where(u => u.CreatedAt.Year == lastMonthYear && u.CreatedAt.Month == lastMonth)
                .CountAsync();

            var customerGrowth = lastMonthCustomers > 0
                ? Math.Round((double)(thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers * 100, 1)
                : 100.0;

            // 7. Doanh thu theo tháng
            var monthlyRevenue = await _context.Orders
                .Where(o => o.Status == OrderStatus.Paid
                            && o.OrderType == OrderType.MonthlyRent
                            && o.PaymentDate.Year == year)
                .GroupBy(o => o.PaymentDate.Month)
                .Select(g => new MonthlyRevenueDto
                {
                    Month = g.Key,
                    Revenue = g.Sum(o => o.Amount)
                })
                .ToListAsync();

            var fullMonthlyRevenue = Enumerable.Range(1, 12)
                .Select(m => new MonthlyRevenueDto
                {
                    Month = m,
                    Revenue = monthlyRevenue.FirstOrDefault(r => r.Month == m)?.Revenue ?? 0
                })
                .ToList();

            // 8. Biểu đồ tỷ lệ lấp đầy từng căn hộ
            var occupancyPerApartment = await _context.Apartments
                .Select(a => new OccupancyRateDto
                {
                    ApartmentName = a.Name,
                    Rate = _context.Bookings.Any(b => b.ApartmentId == a.ApartmentId
                                                      && b.Status == BookingStatus.Active
                                                      && b.RentalStartDate <= now
                                                      && b.RentalEndDate >= now)
                        ? 100 : 0
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


using System;
namespace staysocial_be.DTOs.DashboardStatisticsDto
{
    public class DashboardStatisticsDto
    {
        public decimal CurrentRevenue { get; set; }
        public double RevenueGrowthPercent { get; set; }

        public double OccupancyRate { get; set; }
        public double OccupancyGrowthPercent { get; set; }

        public int TotalApartments { get; set; }

        public int NewCustomers { get; set; }
        public double CustomerGrowthPercent { get; set; }

        public List<MonthlyRevenueDto> MonthlyRevenueChart { get; set; }
        public List<OccupancyRateDto> OccupancyRateChart { get; set; }
    }

    public class MonthlyRevenueDto
    {
        public int Month { get; set; }
        public decimal Revenue { get; set; }
    }

    public class OccupancyRateDto
    {
        public string ApartmentName { get; set; }
        public double Rate { get; set; }
    }

}


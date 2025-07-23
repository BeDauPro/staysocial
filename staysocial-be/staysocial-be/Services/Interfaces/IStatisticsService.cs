using System;
using staysocial_be.DTOs.DashboardStatisticsDto;

namespace staysocial_be.Services.Interfaces
{
    public interface IStatisticsService
    {
        Task<DashboardStatisticsDto> GetDashboardStatisticsAsync(int year);
    }
}


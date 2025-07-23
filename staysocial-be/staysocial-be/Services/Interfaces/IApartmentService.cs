using System;
using staysocial_be.DTOs.Apartment;
using staysocial_be.Models;

namespace staysocial_be.Services.Interfaces
{
    public interface IApartmentService
    {
        Task<IEnumerable<ApartmentDto>> GetApprovedApartmentsAsync();
        Task<IEnumerable<ApartmentDto>> GetAllForAdminAsync();
        Task<bool> ApproveApartmentAsync(int id);
        Task<bool> HideApartmentAsync(int id);
        Task<ApartmentDto> GetByIdAsync(int id);
        Task<IEnumerable<ApartmentDto>> GetApartmentsByOwnerAsync(string userId);
        Task<ApartmentDto> CreateAsync(CreateApartmentDto dto, string userId);
        Task<bool> UpdateAsync(int id, UpdateApartmentDto dto, string userId, bool isAdmin);
        Task<bool> DeleteAsync(int id, string userId, bool isAdmin);
    }
}


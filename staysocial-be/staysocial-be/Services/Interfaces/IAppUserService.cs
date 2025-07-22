using System;
using staysocial_be.DTOs.User;

namespace staysocial_be.Services
{
    public interface IAppUserService
    {
        Task<AppUserDto> CreateUserAsync(CreateAppUserDto dto);
        Task<IEnumerable<AppUserDto>> GetAllUsersAsync();
        Task<AppUserDto> GetUserByIdAsync(string id);
        Task<bool> UpdateUserAsync(string id, UpdateAppUserDto dto);
        Task<bool> DeleteUserAsync(string id);
    }
}


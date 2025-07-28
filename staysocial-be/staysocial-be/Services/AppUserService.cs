using AutoMapper;
using Microsoft.AspNetCore.Identity;
using staysocial_be.DTOs.User;
using staysocial_be.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace staysocial_be.Services
{
    public class AppUserService : IAppUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AppUserService(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // SỬA LẠI - Method này chỉ dùng để tạo user mới thực sự
        public async Task<AppUserDto> CreateUserAsync(CreateAppUserDto dto)
        {
            // Cần email và username để tạo user
            if (string.IsNullOrEmpty(dto.Email))
            {
                throw new ArgumentException("Email is required to create user");
            }

            // Kiểm tra user đã tồn tại chưa
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException($"User with email {dto.Email} already exists");
            }

            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                FullName = dto.FullName,
                Address = dto.Address
            };

            var result = await _userManager.CreateAsync(user, "Default@123");
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create user: {errors}");
            }

            // Add default role nếu có
            if (!string.IsNullOrEmpty(dto.Role))
            {
                await _userManager.AddToRoleAsync(user, dto.Role);
            }

            var roles = await _userManager.GetRolesAsync(user);
            return new AppUserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Role = roles.FirstOrDefault() ?? "Unknown"
            };
        }

        public async Task<IEnumerable<AppUserDto>> GetAllUsersAsync()
        {
            var users = _userManager.Users.ToList();
            var list = new List<AppUserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                list.Add(new AppUserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    Role = roles.FirstOrDefault() ?? "Unknown"
                });
            }

            return list;
        }

        public async Task<AppUserDto> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            return new AppUserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                AvatarUrl = user.AvatarUrl,
                Role = roles.FirstOrDefault() ?? "Unknown"
            };
        }

        public async Task<bool> UpdateUserAsync(string id, UpdateAppUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return false;

            // Chỉ cập nhật những field được gửi lên (không null/empty)
            if (!string.IsNullOrEmpty(dto.FullName))
                user.FullName = dto.FullName;

            if (!string.IsNullOrEmpty(dto.PhoneNumber))
                user.PhoneNumber = dto.PhoneNumber;

            if (!string.IsNullOrEmpty(dto.Address))
                user.Address = dto.Address;
            
            if (!string.IsNullOrEmpty(dto.Email))
                user.Email = dto.Email;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }
    }
}
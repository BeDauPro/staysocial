using System;
using Org.BouncyCastle.Crypto;
using staysocial_be.Data;
using staysocial_be.DTOs.Apartment;
using staysocial_be.Models;
using staysocial_be.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using staysocial_be.Models.Enums;
using AutoMapper.QueryableExtensions;

namespace staysocial_be.Services
{
    public class ApartmentService : IApartmentService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public ApartmentService(AppDbContext context, IMapper mapper, UserManager<AppUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }


        public async Task<IEnumerable<ApartmentDto>> GetApprovedApartmentsAsync()
        {
            return await _context.Apartments
                .Include(a => a.Owner)
                .Where(a => a.Status == ApartmentStatus.Approved)
                .Select(a => _mapper.Map<ApartmentDto>(a))
                .ToListAsync();
        }

        public async Task<IEnumerable<ApartmentDto>> GetAllForAdminAsync()
        {
            return await _context.Apartments
                .Include(a => a.Owner)
                .Select(a => _mapper.Map<ApartmentDto>(a))
                .ToListAsync();
        }

        public async Task<bool> ApproveApartmentAsync(int id)
        {
            var apartment = await _context.Apartments.FindAsync(id);
            if (apartment == null) return false;

            apartment.Status = ApartmentStatus.Approved;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> HideApartmentAsync(int id)
        {
            var apartment = await _context.Apartments.FindAsync(id);

            if (apartment == null)
                return false;

            apartment.Status = ApartmentStatus.Hidden;
            _context.Apartments.Update(apartment);
            await _context.SaveChangesAsync();

            return true;
        }

        // Trong ApartmentService.cs, sửa method GetByIdAsync:
        public async Task<ApartmentDto> GetByIdAsync(int id)
        {
            var apartment = await _context.Apartments
                .Include(a => a.Owner)
                .Include(a => a.Photos) // Thêm dòng này để include Photos
                .FirstOrDefaultAsync(a => a.ApartmentId == id);

            return apartment == null ? null : _mapper.Map<ApartmentDto>(apartment);
        }

        public async Task<IEnumerable<ApartmentDto>> GetApartmentsByOwnerAsync(string userId)
        {
            var apartments = await _context.Apartments
                .Where(a => a.OwnerId == userId)
                .ProjectTo<ApartmentDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return apartments;
        }

        public async Task<ApartmentDto> CreateAsync(CreateApartmentDto dto, string userId)
        {
            var owner = await _userManager.FindByIdAsync(userId);
            if (owner == null)
                throw new Exception("Không tìm thấy người dùng sở hữu căn hộ.");

            var apartment = _mapper.Map<Apartment>(dto);
            apartment.OwnerId = userId;
            apartment.CreatedAt = DateTime.UtcNow;

            apartment.Status = ApartmentStatus.Pending;

            _context.Apartments.Add(apartment);
            await _context.SaveChangesAsync();

            return _mapper.Map<ApartmentDto>(apartment);
        }


        public async Task<bool> UpdateAsync(int id, UpdateApartmentDto dto, string userId, bool isAdmin)
        {
            var apartment = await _context.Apartments.FindAsync(id);
            if (apartment == null) return false;

            if (!isAdmin && apartment.OwnerId != userId)
                return false;

            _mapper.Map(dto, apartment);

            // Nếu không phải admin, không cho phép thay đổi trạng thái duyệt
            if (!isAdmin)
            {
                // Giữ nguyên trạng thái cũ
                _context.Entry(apartment).Property(x => x.Status).IsModified = false;
            }

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteAsync(int id, string userId, bool isAdmin)
        {
            var apartment = await _context.Apartments.FindAsync(id);
            if (apartment == null) return false;

            if (!isAdmin && apartment.OwnerId != userId)
                return false;

            _context.Apartments.Remove(apartment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}


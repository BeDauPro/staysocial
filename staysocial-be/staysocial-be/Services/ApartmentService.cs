using System;
using Org.BouncyCastle.Crypto;
using staysocial_be.Data;
using staysocial_be.DTOs.Apartment;
using staysocial_be.Models;
using staysocial_be.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

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


        public async Task<IEnumerable<ApartmentDto>> GetAllAsync()
        {
            var apartments = await _context.Apartments.Include(a => a.Owner).ToListAsync();
            return _mapper.Map<IEnumerable<ApartmentDto>>(apartments);
        }

        public async Task<ApartmentDto> GetByIdAsync(int id)
        {
            var apartment = await _context.Apartments.Include(a => a.Owner).FirstOrDefaultAsync(a => a.ApartmentId == id);
            return _mapper.Map<ApartmentDto>(apartment);
        }

        public async Task<ApartmentDto> CreateAsync(CreateApartmentDto dto, string userId)
        {
            var owner = await _userManager.FindByIdAsync(userId);
            if (owner == null)
                throw new Exception("Không tìm thấy người dùng sở hữu căn hộ.");

            var apartment = _mapper.Map<Apartment>(dto);
            apartment.OwnerId = userId;
            apartment.CreatedAt = DateTime.UtcNow;

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


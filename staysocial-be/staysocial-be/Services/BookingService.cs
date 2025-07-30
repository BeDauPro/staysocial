using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs.Booking;
using staysocial_be.Models;
using staysocial_be.Models.Enums;
using staysocial_be.Services.Interfaces;

namespace staysocial_be.Services
{
    public class BookingService : IBookingService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public BookingService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Apartment)
                .ToListAsync();
            return _mapper.Map<IEnumerable<BookingDto>>(bookings);
        }

        public async Task<BookingDto> GetBookingByIdAsync(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Apartment)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            return booking == null ? null : _mapper.Map<BookingDto>(booking);
        }

        public async Task<BookingDto> CreateBookingAsync(CreateBookingDto dto, string userId)
        {
            var apartment = await _context.Apartments.FindAsync(dto.ApartmentId);
            if (apartment == null) return null;

            if (dto.RentalStartDate >= dto.RentalEndDate || dto.RentalStartDate.Date < DateTime.Today.Date)
                return null;

            int totalMonths = ((dto.RentalEndDate.Year - dto.RentalStartDate.Year) * 12) + dto.RentalEndDate.Month - dto.RentalStartDate.Month + 1;

            decimal monthlyRent = apartment.Price;
            decimal totalRent = monthlyRent * totalMonths;
            decimal deposit = totalRent * 0.3m;

            var booking = new Booking
            {
                ApartmentId = dto.ApartmentId,
                UserId = userId, 
                RentalStartDate = dto.RentalStartDate,
                RentalEndDate = dto.RentalEndDate,
                TotalMonths = totalMonths,
                MonthlyRent = monthlyRent,
                DepositAmount = deposit,
                TotalRentAmount = totalRent,
                Status = BookingStatus.DepositPending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return _mapper.Map<BookingDto>(booking);
        }


        public async Task<bool> DeleteBookingAsync(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return false;

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}

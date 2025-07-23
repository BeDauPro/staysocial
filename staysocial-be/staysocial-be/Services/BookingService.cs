using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs.Booking;
using staysocial_be.Models;
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
            var booking = await _context.Bookings.FindAsync(id);
            return _mapper.Map<BookingDto>(booking);
        }

        public async Task<BookingDto> CreateBookingAsync(CreateBookingDto dto)
        {
            var timeParts = dto.TimeSlot.Split(" - ");
            if (timeParts.Length != 2)
                throw new ArgumentException("Invalid time slot format.");

            var startTime = TimeSpan.Parse(timeParts[0]);
            var endTime = TimeSpan.Parse(timeParts[1]);

            var scheduledStart = dto.BookingDate.Date + startTime;
            var scheduledEnd = dto.BookingDate.Date + endTime;

            var booking = new Booking
            {
                ApartmentId = dto.ApartmentId,
                UserId = dto.UserId,
                BookingDate = DateTime.UtcNow,
                ScheduledTimeStart = scheduledStart,
                ScheduledTimeEnd = scheduledEnd,
                IsDepositPaid = dto.DepositAmount > 0,
                DepositAmount = dto.DepositAmount,
                Status = "Pending",
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


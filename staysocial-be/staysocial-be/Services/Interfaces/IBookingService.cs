using System;
using staysocial_be.DTOs.Booking;

namespace staysocial_be.Services.Interfaces
{
    public interface IBookingService
    {
        Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
        Task<BookingDto> GetBookingByIdAsync(int id);
        Task<BookingDto> CreateBookingAsync(CreateBookingDto dto, string userId);
        Task<bool> DeleteBookingAsync(int id);
    }
}


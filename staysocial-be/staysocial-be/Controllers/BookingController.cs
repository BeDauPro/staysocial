using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using staysocial_be.DTOs.Booking;
using staysocial_be.Services.Interfaces;

namespace staysocial_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null) return NotFound();
            return Ok(booking);
        }

        [HttpPost("booking")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            var result = await _bookingService.CreateBookingAsync(dto);
            if (result == null)
                return BadRequest("Tạo lịch hẹn thất bại");

            return Ok(result);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _bookingService.DeleteBookingAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}


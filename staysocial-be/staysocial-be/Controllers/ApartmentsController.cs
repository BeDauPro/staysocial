using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs.Apartment;
using staysocial_be.Models;
using staysocial_be.Services;
using staysocial_be.Services.Interfaces;


namespace staysocial_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApartmentsController : ControllerBase
    {
        private readonly IApartmentService _service;
        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _context;
        public ApartmentsController(IApartmentService service, UserManager<AppUser> userManager)
        {
            _service = service;

            _userManager = userManager;
            
        }

        [HttpGet("approved")]
        [Authorize]
        public async Task<IActionResult> GetApprovedApartments()
        {
            var apartments = await _service.GetApprovedApartmentsAsync();
            return Ok(apartments);
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllApartmentsForAdmin()
        {
            var apartments = await _service.GetAllForAdminAsync();
            return Ok(apartments);
        }

        [HttpPut("approve/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveApartment(int id)
        {
            var success = await _service.ApproveApartmentAsync(id);
            if (!success) return NotFound();

            return Ok(new { message = "Căn hộ đã được duyệt." });
        }
        [HttpPut("hiden/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> HideApartment(int id)
        {
            var result = await _service.HideApartmentAsync(id);

            if (!result)
                return NotFound("Căn hộ không tồn tại.");

            return Ok("Căn hộ đã bị ẩn.");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var apartment = await _service.GetByIdAsync(id);
                return apartment == null ? NotFound() : Ok(apartment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving the apartment");
            }
        }

        [HttpGet("my-apartments")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> GetMyApartments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var apartments = await _service.GetApartmentsByOwnerAsync(userId);
            return Ok(apartments);
        }

        [HttpPost]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Create([FromForm] CreateApartmentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _service.CreateAsync(dto, userId);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateApartmentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var success = await _service.UpdateAsync(id, dto, userId, isAdmin);
            return success ? Ok() : Forbid();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Landlord,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var success = await _service.DeleteAsync(id, userId, isAdmin);
            return success ? Ok() : Forbid();
        }
    }

}


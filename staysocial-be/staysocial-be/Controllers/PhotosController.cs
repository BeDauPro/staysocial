using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs.Apartment;
using staysocial_be.Models;
using staysocial_be.Services.Interfaces;

namespace staysocial_be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPhotoService _photoService;

        public PhotosController(AppDbContext context, IPhotoService photoService)
        {
            _context = context;
            _photoService = photoService;
        }
     
        [HttpPost]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> UploadPhoto([FromForm] PhotoUploadDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("File is required.");

            var (url, publicId) = await _photoService.UploadImageAsync(dto.File);

            var photo = new Photo
            {
                Url = url,
                PublicId = publicId,
                ApartmentId = dto.ApartmentId 
            };

            _context.Photos.Add(photo);
            await _context.SaveChangesAsync();

            return Ok(new PhotoDto
            {
                Id = photo.Id,
                Url = photo.Url,
                UploadedAt = photo.UploadedAt,
                ApartmentId = photo.ApartmentId
            });
        }

       
        [HttpGet("apartment/{apartmentId}")]
        public async Task<IActionResult> GetPhotosByApartment(int apartmentId)
        {
            var photos = await _context.Photos
                .Where(p => p.ApartmentId == apartmentId)
                .Select(p => new PhotoDto
                {
                    Id = p.Id,
                    Url = p.Url,
                    UploadedAt = p.UploadedAt,
                    ApartmentId = p.ApartmentId
                })
                .ToListAsync();

            return Ok(photos);
        }

        // ✅ Update GetAllPhotos để include ApartmentId
        [HttpGet]
        public async Task<IActionResult> GetAllPhotos()
        {
            var photos = await _context.Photos
                .Select(p => new PhotoDto
                {
                    Id = p.Id,
                    Url = p.Url,
                    UploadedAt = p.UploadedAt,
                    ApartmentId = p.ApartmentId
                }).ToListAsync();
            return Ok(photos);
        }

        // [GET] Get one photo
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null) return NotFound();

            return Ok(new PhotoDto { Id = photo.Id, Url = photo.Url, UploadedAt = photo.UploadedAt });
        }

        // [PUT] Update photo (replace file)
        [HttpPut("{id}")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> UpdatePhoto(int id, [FromForm] PhotoUploadDto dto)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null) return NotFound();

            // Xoá ảnh cũ
            await _photoService.DeleteImageAsync(photo.PublicId);

            // Upload ảnh mới
            var (url, publicId) = await _photoService.UploadImageAsync(dto.File);
            photo.Url = url;
            photo.PublicId = publicId;
            photo.UploadedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new PhotoDto { Id = photo.Id, Url = photo.Url, UploadedAt = photo.UploadedAt });
        }

        // [DELETE] Delete photo
        [HttpDelete("{id}")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> DeletePhoto(int id)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null) return NotFound();

            await _photoService.DeleteImageAsync(photo.PublicId);
            _context.Photos.Remove(photo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}


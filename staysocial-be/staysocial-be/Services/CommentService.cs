using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs;
using staysocial_be.DTOs.Comment;
using staysocial_be.Models;
using staysocial_be.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace staysocial_be.Services
{
    public class CommentService : ICommentService
    {
        private readonly AppDbContext _context;

        public CommentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CommentResponseDto> CreateCommentAsync(string userId, CreateCommentDto createCommentDto)
        {
            // Kiểm tra apartment có tồn tại không
            var apartment = await _context.Apartments
                .FirstOrDefaultAsync(a => a.ApartmentId == createCommentDto.ApartmentId);

            if (apartment == null)
                throw new KeyNotFoundException("Apartment not found.");

            var comment = new Comment
            {
                UserId = userId,
                ApartmentId = createCommentDto.ApartmentId,
                Content = createCommentDto.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return await GetCommentResponseDto(comment);
        }

        public async Task<CommentResponseDto> GetCommentByIdAsync(int commentId)
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Apartment)
                .FirstOrDefaultAsync(c => c.CommentId == commentId);

            if (comment == null)
                throw new KeyNotFoundException("Comment not found.");

            return MapToResponseDto(comment);
        }

        public async Task<List<CommentResponseDto>> GetCommentsByApartmentIdAsync(int apartmentId)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Apartment)
                .Where(c => c.ApartmentId == apartmentId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return comments.Select(MapToResponseDto).ToList();
        }

        public async Task<List<CommentResponseDto>> GetCommentsByUserIdAsync(string userId)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Apartment)
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return comments.Select(MapToResponseDto).ToList();
        }

        public async Task<CommentResponseDto> UpdateCommentAsync(int commentId, string userId, UpdateCommentDto updateCommentDto)
        {
            var comment = await _context.Comments
                .FirstOrDefaultAsync(c => c.CommentId == commentId);

            if (comment == null)
                throw new KeyNotFoundException("Comment not found.");

            if (comment.UserId != userId)
                throw new UnauthorizedAccessException("You can only update your own comments.");

            comment.Content = updateCommentDto.Content;

            await _context.SaveChangesAsync();

            return await GetCommentResponseDto(comment);
        }

        public async Task<bool> DeleteCommentAsync(int commentId, string userId)
        {
            var comment = await _context.Comments
                .FirstOrDefaultAsync(c => c.CommentId == commentId);

            if (comment == null)
                return false;

            if (comment.UserId != userId)
                throw new UnauthorizedAccessException("You can only delete your own comments.");

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<CommentResponseDto> GetCommentResponseDto(Comment comment)
        {
            var commentWithIncludes = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Apartment)
                .FirstOrDefaultAsync(c => c.CommentId == comment.CommentId);

            return MapToResponseDto(commentWithIncludes);
        }

        private static CommentResponseDto MapToResponseDto(Comment comment)
        {
            return new CommentResponseDto
            {
                CommentId = comment.CommentId,
                UserId = comment.UserId,
                UserName = comment.User?.UserName ?? "Unknown",
                FullName = comment.User?.FullName ?? "Unknown", // Thêm dòng này
                ApartmentId = comment.ApartmentId,
                ApartmentName = comment.Apartment?.Name ?? "Unknown",
                Content = comment.Content,
                CreatedAt = comment.CreatedAt
            };
        }
    }
}
using System;
using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs.Reaction;
using staysocial_be.Models;
using staysocial_be.Models.Enums;
using staysocial_be.Services.Interfaces;

namespace staysocial_be.Services
{
    public class ReactionService : IReactionService
    {
        private readonly AppDbContext _context;

        public ReactionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task ToggleReactionAsync(string userId, CreateReactionDto dto)
        {
            var existing = await _context.Reactions
                .FirstOrDefaultAsync(r => r.UserId == userId && r.ApartmentId == dto.ApartmentId);

            if (existing == null)
            {
                var reaction = new Reaction
                {
                    UserId = userId,
                    ApartmentId = dto.ApartmentId,
                    Type = dto.Type,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Reactions.Add(reaction);
            }
            else
            {
                if (existing.Type == dto.Type)
                {
                    // Bấm lại cùng loại -> bỏ reaction
                    _context.Reactions.Remove(existing);
                }
                else
                {
                    // Đổi loại
                    existing.Type = dto.Type;
                    existing.CreatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<(int likes, int dislikes)> GetReactionCountAsync(int apartmentId)
        {
            var likes = await _context.Reactions
                .CountAsync(r => r.ApartmentId == apartmentId && r.Type == ReactionType.Like);
            var dislikes = await _context.Reactions
                .CountAsync(r => r.ApartmentId == apartmentId && r.Type == ReactionType.Dislike);

            return (likes, dislikes);
        }
    }
}


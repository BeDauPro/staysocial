using System;
using staysocial_be.DTOs.Reaction;

namespace staysocial_be.Services.Interfaces
{
    public interface IReactionService
    {
        Task ToggleReactionAsync(string userId, CreateReactionDto dto);
        Task<(int likes, int dislikes)> GetReactionCountAsync(int apartmentId);
    }
}


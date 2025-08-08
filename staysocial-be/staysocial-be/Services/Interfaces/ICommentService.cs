using System;
using staysocial_be.DTOs.Comment;

namespace staysocial_be.Services.Interfaces
{
    public interface ICommentService
    {
        Task<CommentResponseDto> CreateCommentAsync(string userId, CreateCommentDto createCommentDto);
        Task<CommentResponseDto> GetCommentByIdAsync(int commentId);
        Task<List<CommentResponseDto>> GetCommentsByApartmentIdAsync(int apartmentId);
        Task<List<CommentResponseDto>> GetCommentsByUserIdAsync(string userId);
        Task<CommentResponseDto> UpdateCommentAsync(int commentId, string userId, UpdateCommentDto updateCommentDto);
        Task<bool> DeleteCommentAsync(int commentId, string userId);
    }
}


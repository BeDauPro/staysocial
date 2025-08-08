using System;
using staysocial_be.DTOs.Feedback;

namespace staysocial_be.Services.Interfaces
{
    public interface IFeedbackService
    {
        Task<FeedbackResponseDto> CreateFeedbackAsync(string userId, CreateFeedbackDto createFeedbackDto);
        Task<FeedbackResponseDto> GetFeedbackByIdAsync(int feedbackId);
        Task<List<FeedbackResponseDto>> GetFeedbacksByApartmentIdAsync(int apartmentId);
        Task<List<FeedbackResponseDto>> GetFeedbacksByUserIdAsync(string userId);
        Task<FeedbackResponseDto> UpdateFeedbackAsync(int feedbackId, string userId, UpdateFeedbackDto updateFeedbackDto);
        Task<bool> DeleteFeedbackAsync(int feedbackId, string userId);
        Task<double> GetAverageRatingByApartmentIdAsync(int apartmentId);
    }
}


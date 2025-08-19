using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs;
using staysocial_be.DTOs.Feedback;
using staysocial_be.Models;
using staysocial_be.Models.Enums;
using staysocial_be.Services.Interfaces;

namespace staysocial_be.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly AppDbContext _context;

        public FeedbackService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<FeedbackResponseDto> CreateFeedbackAsync(string userId, CreateFeedbackDto createFeedbackDto)
        {
            // 1) Kiểm tra booking có thuộc về user và căn hộ này không
            var bookingInfo = await _context.Bookings
                .Where(b => b.UserId == userId && b.ApartmentId == createFeedbackDto.ApartmentId)
                .FirstOrDefaultAsync();

            if (bookingInfo == null)
                throw new InvalidOperationException("Bạn chưa thuê căn hộ này.");

            // 2) Tìm order đã thanh toán của booking này
            var matchedOrder = await _context.Orders
                .Where(o => o.BookingId == bookingInfo.BookingId && o.Status == OrderStatus.Paid)
                .OrderByDescending(o => o.OrderId) // lấy đơn gần nhất
                .FirstOrDefaultAsync();

            if (matchedOrder == null)
                throw new InvalidOperationException("Đơn thuê chưa được thanh toán hoặc chưa hoàn tất.");

            // 3) Kiểm tra đã đánh giá chưa
            var alreadyReviewed = await _context.Feedbacks
                .AnyAsync(f => f.UserId == userId && f.OrderId == matchedOrder.OrderId);
            if (alreadyReviewed)
                throw new InvalidOperationException("Bạn đã đánh giá đơn thuê này rồi.");

            // 4) Tạo feedback
            var feedback = new Feedback
            {
                UserId = userId,
                ApartmentId = createFeedbackDto.ApartmentId,
                OrderId = matchedOrder.OrderId,
                Rating = createFeedbackDto.Rating,
                Comment = createFeedbackDto.Comment?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return await GetFeedbackResponseDto(feedback);

        }


        public async Task<FeedbackResponseDto> GetFeedbackByIdAsync(int feedbackId)
        {
            var feedback = await _context.Feedbacks
                .Include(f => f.User)
                .Include(f => f.Apartment)
                .FirstOrDefaultAsync(f => f.FeedbackId == feedbackId);

            if (feedback == null)
                throw new KeyNotFoundException("Feedback not found.");

            return MapToResponseDto(feedback);
        }

        public async Task<List<FeedbackResponseDto>> GetFeedbacksByApartmentIdAsync(int apartmentId)
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.User)
                .Include(f => f.Apartment)
                .Where(f => f.ApartmentId == apartmentId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return feedbacks.Select(MapToResponseDto).ToList();
        }

        public async Task<List<FeedbackResponseDto>> GetFeedbacksByUserIdAsync(string userId)
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.User)
                .Include(f => f.Apartment)
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return feedbacks.Select(MapToResponseDto).ToList();
        }

        public async Task<FeedbackResponseDto> UpdateFeedbackAsync(int feedbackId, string userId, UpdateFeedbackDto updateFeedbackDto)
        {
            var feedback = await _context.Feedbacks
                .FirstOrDefaultAsync(f => f.FeedbackId == feedbackId);

            if (feedback == null)
                throw new KeyNotFoundException("Feedback not found.");

            if (feedback.UserId != userId)
                throw new UnauthorizedAccessException("You can only update your own feedback.");

            feedback.Rating = updateFeedbackDto.Rating;
            feedback.Comment = updateFeedbackDto.Comment;

            await _context.SaveChangesAsync();

            return await GetFeedbackResponseDto(feedback);
        }

        public async Task<bool> DeleteFeedbackAsync(int feedbackId, string userId)
        {
            var feedback = await _context.Feedbacks
                .FirstOrDefaultAsync(f => f.FeedbackId == feedbackId);

            if (feedback == null)
                return false;

            if (feedback.UserId != userId)
                throw new UnauthorizedAccessException("You can only delete your own feedback.");

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<double> GetAverageRatingByApartmentIdAsync(int apartmentId)
        {
            var ratings = await _context.Feedbacks
                .Where(f => f.ApartmentId == apartmentId)
                .Select(f => f.Rating)
                .ToListAsync();

            return ratings.Any() ? ratings.Average() : 0;
        }

        private async Task<FeedbackResponseDto> GetFeedbackResponseDto(Feedback feedback)
        {
            var feedbackWithIncludes = await _context.Feedbacks
                .Include(f => f.User)
                .Include(f => f.Apartment)
                .FirstOrDefaultAsync(f => f.FeedbackId == feedback.FeedbackId);

            return MapToResponseDto(feedbackWithIncludes);
        }

        private static FeedbackResponseDto MapToResponseDto(Feedback feedback)
        {
            return new FeedbackResponseDto
            {
                FeedbackId = feedback.FeedbackId,
                UserId = feedback.UserId,
                FullName = feedback.User?.FullName ?? "Unknown",
                ApartmentId = feedback.ApartmentId,
                ApartmentName = feedback.Apartment?.Name ?? "Unknown", 
                OrderId = feedback.OrderId,
                Rating = feedback.Rating,
                Comment = feedback.Comment,
                CreatedAt = feedback.CreatedAt
            };
        }
    }
}
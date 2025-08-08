using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using staysocial_be.DTOs;
using staysocial_be.DTOs.Feedback;
using staysocial_be.Services;
using staysocial_be.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace staysocial_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpPost]
        public async Task<ActionResult<FeedbackResponseDto>> CreateFeedback([FromBody] CreateFeedbackDto createFeedbackDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var feedback = await _feedbackService.CreateFeedbackAsync(userId, createFeedbackDto);
                return CreatedAtAction(nameof(GetFeedbackById), new { id = feedback.FeedbackId }, feedback);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<FeedbackResponseDto>> GetFeedbackById(int id)
        {
            try
            {
                var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
                return Ok(feedback);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("apartment/{apartmentId}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<FeedbackResponseDto>>> GetFeedbacksByApartmentId(int apartmentId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetFeedbacksByApartmentIdAsync(apartmentId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("apartment/{apartmentId}/average-rating")]
        [AllowAnonymous]
        public async Task<ActionResult<double>> GetAverageRatingByApartmentId(int apartmentId)
        {
            try
            {
                var averageRating = await _feedbackService.GetAverageRatingByApartmentIdAsync(apartmentId);
                return Ok(new { ApartmentId = apartmentId, AverageRating = Math.Round(averageRating, 2) });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user")]
        public async Task<ActionResult<List<FeedbackResponseDto>>> GetMyFeedbacks()
        {
            try
            {
                var userId = GetCurrentUserId();
                var feedbacks = await _feedbackService.GetFeedbacksByUserIdAsync(userId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                   throw new UnauthorizedAccessException("User ID not found in claims.");
        }
    }
}
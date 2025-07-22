using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using staysocial_be.DTOs.User;
using staysocial_be.Services;
using System.Security.Claims;

namespace staysocial_be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppUsersController : ControllerBase
    {
        private readonly IAppUserService _appUserService;

        public AppUsersController(IAppUserService appUserService)
        {
            _appUserService = appUserService;
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateAppUserDto dto)
        {
            try
            {
                // Lấy User ID từ JWT token
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Unable to get user information from token");
                }

                var result = await _appUserService.UpdateUserAsync(userId, dto);

                if (!result)
                    return BadRequest("Failed to update profile.");

                // Trả về thông tin user đã cập nhật
                var updatedUser = await _appUserService.GetUserByIdAsync(userId);
                return Ok(new
                {
                    message = "Profile updated successfully",
                    user = updatedUser
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating profile: {ex.Message}");
            }
        }


        [HttpPost("create")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> CreateUser([FromBody] CreateAppUserDto dto)
        {
            var result = await _appUserService.CreateUserAsync(dto);
            if (result == null)
                return BadRequest("Failed to create user.");
            return Ok(result);
        }


        [HttpGet("my-profile")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Unable to get user information from token");
            }

            var user = await _appUserService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            return Ok(user);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _appUserService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _appUserService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound("User not found.");
            return Ok(user);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "User, Landlord")] 
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateAppUserDto dto)
        {
            var result = await _appUserService.UpdateUserAsync(id, dto);
            if (!result)
                return BadRequest("Failed to update user.");
            return Ok("User updated successfully.");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _appUserService.DeleteUserAsync(id);
            if (!result)
                return BadRequest("Failed to delete user.");
            return Ok("User deleted successfully.");
        }
    }
}
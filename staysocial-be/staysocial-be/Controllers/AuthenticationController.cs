using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using staysocial_be.DTOs.Auth;
using staysocial_be.Models;
using staysocial_be.Services;
using staysocial_be.Services.Interfaces;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace staysocial_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IAuthService _authService;

        public AuthenticationController(
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IEmailService emailService,
            IAuthService authService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _emailService = emailService;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.Password != dto.ConfirmPassword)
                return BadRequest(new { error = "Mật khẩu và xác nhận mật khẩu không khớp." });

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { error = "Email đã được sử dụng." });

            var verificationToken = Guid.NewGuid().ToString();
            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                IsVerified = false,
                VerificationToken = verificationToken,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(new { error = "Không thể tạo tài khoản.", details = result.Errors });

            // Gán mặc định vai trò là "User"
            const string defaultRole = "Landlord";
            if (!await _roleManager.RoleExistsAsync(defaultRole))
                await _roleManager.CreateAsync(new IdentityRole(defaultRole));

            await _userManager.AddToRoleAsync(user, defaultRole);

            // Gửi email xác thực
            var verifyLink = $"{_configuration["App:VerifyEmailUrl"]}?token={verificationToken}";
            var message = $"<h3>Xác thực tài khoản</h3><p>Nhấn vào liên kết sau để xác thực tài khoản:</p><a href='{verifyLink}'>{verifyLink}</a>";

            await _emailService.SendEmailAsync(user.Email, "Xác thực tài khoản StaySocial", message);

            return Ok(new
            {
                message = "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
                userId = user.Id
            });
        }

        // Xác thực email
        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(u => u.VerificationToken == token);

            if (user == null)
                return BadRequest(new { error = "Token không hợp lệ hoặc đã hết hạn." });

            user.IsVerified = true;             
            user.EmailConfirmed = true;       
            user.VerificationToken = null;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return StatusCode(500, new { error = "Đã có lỗi khi cập nhật người dùng." });
            }

            return Ok(new { message = "Tài khoản đã được xác thực thành công." });
        }


        // Đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto payload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Vui lòng nhập đầy đủ thông tin" });
            }

            var user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, payload.Password))
            {
                return Unauthorized(new { error = "Email hoặc mật khẩu không đúng" });
            }

            if (!user.EmailConfirmed)
            {
                return Unauthorized(new { error = "Email chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản." });
            }
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "User";
            var token = await _authService.GenerateJwtToken(user, role);

            return Ok(new
            {
                token,
                email = user.Email,
                role
            });
        }

        // Quên mật khẩu
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Ok(); // Trả về thành công để tránh dò email

            user.PasswordResetToken = Guid.NewGuid().ToString();
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(1);
            await _userManager.UpdateAsync(user);

            var link = $"{_configuration["App:ResetPasswordUrl"]}?token={user.PasswordResetToken}";
            var message = $"<p>Đặt lại mật khẩu tại đây:</p><a href='{link}'>{link}</a>";

            await _emailService.SendEmailAsync(user.Email, "Đặt lại mật khẩu StaySocial", message);
            return Ok(new { message = "Email đặt lại mật khẩu đã được gửi (nếu tài khoản tồn tại)." });
        }

        // Đặt lại mật khẩu
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u =>
                u.PasswordResetToken == dto.Token && u.ResetTokenExpires > DateTime.UtcNow);

            if (user == null)
                return BadRequest("Token không hợp lệ hoặc đã hết hạn");

            var resetResult = await _userManager.RemovePasswordAsync(user);
            if (!resetResult.Succeeded)
                return BadRequest(resetResult.Errors);

            var addResult = await _userManager.AddPasswordAsync(user, dto.NewPassword);
            if (!addResult.Succeeded)
                return BadRequest(addResult.Errors);

            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Mật khẩu đã được đặt lại thành công." });
        }
    }

}

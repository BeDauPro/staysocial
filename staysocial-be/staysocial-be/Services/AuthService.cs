using System;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using staysocial_be.Models;
using staysocial_be.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace staysocial_be.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IConfiguration config, ILogger<AuthService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public Task<string> GenerateJwtToken(AppUser user, string role)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),                   
        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.Role, role)
    };

            var jwtKey = _config["JWT:Secret"];

            if (string.IsNullOrEmpty(jwtKey))
            {
                _logger.LogError("JWT:Key chưa được cấu hình trong appsettings.json.");
                throw new InvalidOperationException("Khóa bí mật JWT chưa được cấu hình.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            if (!double.TryParse(_config["JWT:ExpiresInMinutes"], out double expiresInMinutes))
            {
                expiresInMinutes = 60;
                _logger.LogWarning("JWT:ExpiresInMinutes chưa được cấu hình hoặc không hợp lệ. Sử dụng giá trị mặc định là {minutes} phút.", expiresInMinutes);
            }

            var token = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
                signingCredentials: creds
            );

            return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
        }
    }
}

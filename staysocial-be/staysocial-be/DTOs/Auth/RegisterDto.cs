using System;
using System.ComponentModel.DataAnnotations;
using staysocial_be.Attributes;
using staysocial_be.Models.Enums;

namespace staysocial_be.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        [ValidEmail]
        public string Email { get; set; }

        [Required, MinLength(6)]
        public string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "Xác nhận mật khẩu không khớp")]
        public string ConfirmPassword { get; set; }

        [Required]
        public string Role { get; set; } // "User" hoặc "Landlord"
    }

}


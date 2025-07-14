using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.DTOs.Auth
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword", ErrorMessage = "Xác nhận mật khẩu không khớp")]
        public string ConfirmPassword { get; set; }
    }
}
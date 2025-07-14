using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.DTOs.Auth
{
    public class ForgotPasswordDto
    {
        [Required]
        public string Email { get; set; }
    }
}


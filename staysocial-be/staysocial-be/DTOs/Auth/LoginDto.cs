using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.DTOs.Auth
{
    public class LoginDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }

}


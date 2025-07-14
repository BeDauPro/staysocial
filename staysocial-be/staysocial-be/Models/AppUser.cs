using System;
using Microsoft.AspNetCore.Identity;

namespace staysocial_be.Models
{
    public class AppUser : IdentityUser
    {
        public bool IsVerified { get; set; }
        public string? VerificationToken { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
    }
}


using System;
namespace staysocial_be.DTOs.Auth
{
    public class VerifyCodeDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }
}


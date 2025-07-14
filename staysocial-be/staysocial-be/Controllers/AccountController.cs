using System;
using Microsoft.AspNetCore.Mvc;
using staysocial_be.Services;

namespace staysocial_be.Controllers
{
    public class AccountController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public AccountController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send-test-email")]
        public async Task<IActionResult> SendTestEmail()
        {
            await _emailService.SendEmailAsync("recipient@example.com", "Test MailKit", "<h1>Hello from SocialStay!</h1>");
            return Ok("Email sent.");
        }
    }

}


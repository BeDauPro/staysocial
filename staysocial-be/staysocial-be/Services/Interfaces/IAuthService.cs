using System;
using staysocial_be.Models;

namespace staysocial_be.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> GenerateJwtToken(AppUser user, string role);
    }
}

